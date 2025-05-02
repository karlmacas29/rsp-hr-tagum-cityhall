<template>
  <q-card class="q-pa-sm" flat style="border-right: 1px solid #e0e0e0; border-radius: 0">
    <q-scroll-area style="flex-grow: 1; height: 85vh">
      <!-- Header -->
      <div class="text-h4 text-bold q-mb-md">Plantilla</div>

      <!-- Office Selection -->
      <q-select
        class="q-mb-lg"
        outlined
        color="green-9"
        v-model="selectedValue"
        :options="getOptions()"
        label="Select Office"
        use-input
        hide-selected
        fill-input
        clearable
        input-debounce="300"
        @filter="filterOptions"
        @update:model-value="handleSelection"
        :loading="usePlantilla.loading"
        style="max-width: 500px"
      >
        <template v-slot:no-option>
          <q-item dense>
            <q-item-section class="text-grey text-subtitle2">No results</q-item-section>
          </q-item>
        </template>
      </q-select>

      <!-- Organizational Structure Tree -->
      <div v-if="selectedValue && structureTree.length > 0" class="q-mt-md">
        <div class="text-h6 q-mb-md">Office Structure</div>

        <div class="">
          <div class="col-12 col-md-8">
            <q-tree
              :nodes="structureTree"
              node-key="id"
              selected-color="primary"
              v-model:selected="selectedNode"
              @update:selected="handleNodeSelection"
            >
              <!-- Custom node label with icon -->
              <template v-slot:default-header="prop">
                <div class="row items-center cursor-pointer q-py-sm">
                  <q-icon
                    :name="getNodeIcon(prop.node)"
                    color="primary"
                    size="sm"
                    class="q-mr-sm"
                  />
                  <div>{{ prop.node.label }}</div>
                  <q-badge v-if="prop.node.positions" color="green" class="q-ml-sm">
                    {{ prop.node.positions }}
                    {{ prop.node.positions > 1 ? 'positions' : 'position' }}
                  </q-badge>
                </div>
              </template>
            </q-tree>
          </div>
        </div>
      </div>

      <!-- No Data Message -->
      <div v-else-if="selectedValue && !usePlantilla.loading" class="text-center q-pa-lg">
        <q-icon name="info" size="2rem" color="grey-7" />
        <div class="text-subtitle1 q-mt-sm">
          No organizational structure data available for this office
        </div>
      </div>

      <!-- Loading Indicator -->
      <div v-else-if="usePlantilla.loading" class="q-pa-md flex flex-center">
        <q-spinner color="primary" size="3em" />
        <span class="q-ml-sm">Getting All Offices...</span>
      </div>

      <div v-else class="text-center q-pa-lg">
        <q-icon name="info" size="2rem" color="grey-7" />
        <div class="text-subtitle1 q-mt-sm text-grey-7">Select Office</div>
      </div>
    </q-scroll-area>
  </q-card>
</template>

<script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { usePlantillaStore } from 'stores/plantillaStore';
  //   import { useRouter } from 'vue-router';
  import { uid } from 'quasar';

  //   const router = useRouter();
  const usePlantilla = usePlantillaStore();
  const selectedValue = ref(null);
  const filteredOptions = ref([]);
  const officeData = ref([]);
  const selectedNode = ref(null);
  const selectedNodeData = ref(null);

  // Define emits to send selected structure to parent component
  const emit = defineEmits(['structure-selected']);

  // Get options for dropdown
  const getOptions = () => {
    return filteredOptions.value || [];
  };

  // Get unique office values
  const getUniqueValues = () => {
    if (!officeData.value.length) return [];
    const values = new Set();

    officeData.value.forEach((office) => {
      if (office.office) values.add(office.office);
    });

    return Array.from(values).sort();
  };

  // Filter options for dropdown
  const filterOptions = (val, update) => {
    if (usePlantilla.loading) return;

    update(() => {
      const needle = val.toLowerCase();
      filteredOptions.value = getUniqueValues().filter((v) => v.toLowerCase().includes(needle));
    });
  };

  // Computed property for organizational structure tree
  const structureTree = computed(() => {
    if (!selectedValue.value || !officeData.value.length) return [];

    // Filter data for the selected office
    const officeItems = officeData.value.filter((item) => item.office === selectedValue.value);

    // Generate tree structure with office as root
    return generateTreeStructure(officeItems, selectedValue.value);
  });

  // Generate hierarchical tree structure with Office as root
  const generateTreeStructure = (items, officeName) => {
    if (!items.length) return [];

    // Create a map for divisions
    const divisions = new Map();

    // Process items to organize them hierarchically
    items.forEach((item) => {
      // Skip if no division (ensure we have proper division data)
      if (!item.division) return;

      // Create division if not exists
      if (!divisions.has(item.division)) {
        divisions.set(item.division, {
          sections: new Map(),
          count: 0,
        });
      }

      const division = divisions.get(item.division);

      // If item has section, organize under section
      if (item.section) {
        if (!division.sections.has(item.section)) {
          division.sections.set(item.section, {
            units: new Map(),
            count: 0,
          });
        }

        const section = division.sections.get(item.section);

        // If item has unit, organize under unit
        if (item.unit) {
          if (!section.units.has(item.unit)) {
            section.units.set(item.unit, {
              count: 0,
            });
          }

          const unit = section.units.get(item.unit);
          unit.count++; // Count positions at unit level
        }

        section.count++; // Count positions at section level
      }

      division.count++; // Count positions at division level
    });

    // Create the root office node
    const rootNode = {
      id: 'office-' + uid(),
      label: officeName,
      nodeType: 'office',
      data: {
        office: officeName,
      },
      positions: items.length,
      children: [],
    };

    // Add divisions as children to the office node
    divisions.forEach((divisionData, divisionName) => {
      const divisionNode = {
        id: 'division-' + uid(),
        label: divisionName,
        nodeType: 'division',
        positions: divisionData.count,
        data: {
          office: officeName,
          division: divisionName,
        },
        children: [],
      };

      // Add sections as children to the division node
      divisionData.sections.forEach((sectionData, sectionName) => {
        const sectionNode = {
          id: 'section-' + uid(),
          label: sectionName,
          nodeType: 'section',
          positions: sectionData.count,
          data: {
            office: officeName,
            division: divisionName,
            section: sectionName,
          },
          children: [],
        };

        // Add units as children to the section node
        sectionData.units.forEach((unitData, unitName) => {
          const unitNode = {
            id: 'unit-' + uid(),
            label: unitName,
            nodeType: 'unit',
            positions: unitData.count,
            data: {
              office: officeName,
              division: divisionName,
              section: sectionName,
              unit: unitName,
            },
          };

          sectionNode.children.push(unitNode);
        });

        // Only add sections with units or with positions
        if (sectionNode.children.length > 0 || sectionData.count > 0) {
          divisionNode.children.push(sectionNode);
        }
      });

      // Only add divisions with sections or with positions
      if (divisionNode.children.length > 0 || divisionData.count > 0) {
        rootNode.children.push(divisionNode);
      }
    });

    return [rootNode]; // Return as array since q-tree expects array
  };

  // Handle selection of an office from dropdown
  const handleSelection = () => {
    selectedNode.value = null;
    selectedNodeData.value = null;

    // Emit office selection to parent automatically when an office is selected or cleared
    if (selectedValue.value) {
      emit('structure-selected', { office: selectedValue.value });
    } else {
      // When selection is cleared, emit null to reset the filter
      emit('structure-selected', null);
    }
  };

  // Handle selection of a node in the tree
  const handleNodeSelection = (key) => {
    // Find the selected node data
    const findNode = (nodes) => {
      for (const node of nodes) {
        if (node.id === key) {
          return node;
        }
        if (node.children && node.children.length) {
          const found = findNode(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    selectedNodeData.value = findNode(structureTree.value);

    // Auto-filter when a node is selected
    if (selectedNodeData.value && selectedNodeData.value.data) {
      emit('structure-selected', selectedNodeData.value.data);
    }
  };

  //   // Function to filter the table by the currently selected node
  //   const filterTableByNode = () => {
  //     if (!selectedNodeData.value || !selectedNodeData.value.data) return;

  //     // Emit the structure data to the parent component to filter the table
  //     emit('structure-selected', selectedNodeData.value.data);
  //   };

  // Get appropriate icon for node type
  const getNodeIcon = (node) => {
    const iconMap = {
      office: 'business',
      division: 'domain',
      section: 'folder',
      unit: 'group_work',
    };

    return iconMap[node.nodeType] || 'label';
  };

  //   // Get color for node badge
  //   const getNodeColor = (node) => {
  //     const colorMap = {
  //       office: 'primary',
  //       division: 'secondary',
  //       section: 'teal',
  //       unit: 'deep-orange'
  //     };

  //     return colorMap[node.nodeType] || 'grey';
  //   };

  //   // Get readable node type name
  //   const getNodeTypeName = (node) => {
  //     const typeMap = {
  //       office: 'Office',
  //       division: 'Division',
  //       section: 'Section',
  //       unit: 'Unit'
  //     };

  //     return typeMap[node.nodeType] || '';
  //   };

  //   // Navigate to the details page with tabs
  //   const navigateToDetails = () => {
  //     if (!selectedNodeData.value || !selectedNodeData.value.data) return;

  //     const data = selectedNodeData.value.data;

  //     // Construct query parameters
  //     const params = {
  //       office: data.office
  //     };

  //     if (data.division) params.division = data.division;
  //     if (data.section) params.section = data.section;
  //     if (data.unit) params.unit = data.unit;

  //     // Navigate to the plantilla details page with tab panels
  //     router.push({
  //       name: 'plantilla-details',
  //       params: { id: selectedNodeData.value.id },
  //       query: params
  //     });
  //   };

  // Watch loading state & update options when data is ready
  watch(
    () => usePlantilla.loading,
    (isLoading) => {
      if (!isLoading) {
        filteredOptions.value = getUniqueValues();
      }
    },
  );

  onMounted(async () => {
    await usePlantilla.fetchPlantilla();
    officeData.value = Array.isArray(usePlantilla.plantilla) ? usePlantilla.plantilla : [];
    filteredOptions.value = getUniqueValues();
  });
</script>
