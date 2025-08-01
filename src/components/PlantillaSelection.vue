<template>
  <q-card class="q-pa-sm">
    <q-scroll-area class="q-pa-sm" style="height: 80vh">
      <div class="text-h5 text-bold q-mb-md">Plantilla</div>

      <q-select
        class="q-mb-lg q-mx-auto"
        outlined
        dense
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
        style="max-width: 230px"
      >
        <template v-slot:no-option>
          <q-item dense>
            <q-item-section class="text-grey text-subtitle2">No results</q-item-section>
          </q-item>
        </template>
      </q-select>

      <div v-if="selectedValue && structureTree.length > 0" class="q-mt-md">
        <div class="text-h6 q-mb-md">Office Structure</div>

        <div class="">
          <div class="col-12 col-md-8">
            <q-tree
              dense
              :nodes="structureTree"
              node-key="id"
              v-model:selected="selectedNode"
              @update:selected="handleNodeSelection"
              class="custom-tree"
            >
              <template v-slot:default-header="prop">
                <div
                  class="row items-center cursor-pointer q-pa-sm"
                  :class="{ 'selected-node': selectedNode === prop.node.id }"
                >
                  <q-icon
                    :name="getNodeIcon(prop.node)"
                    color="primary"
                    size="sm"
                    class="q-mr-sm"
                  />
                  <div class="text-body1">{{ prop.node.label }}</div>
                  <q-badge dense rounded v-if="prop.node.positions" color="green" class="q-ml-sm">
                    {{ prop.node.positions }}
                    {{ prop.node.positions > 1 ? 'positions' : 'position' }}
                  </q-badge>
                </div>
              </template>
            </q-tree>
          </div>
        </div>
      </div>

      <div v-else-if="selectedValue && !usePlantilla.loading" class="text-center q-pa-lg">
        <q-icon name="info" size="2rem" color="grey-7" />
        <div class="text-subtitle1 q-mt-sm">
          No organizational structure data available for this office
        </div>
      </div>

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

  const props = defineProps({
    positions: {
      type: Array,
      required: true,
    },
  });

  function countPositionsForNode(nodeType, nodeData, positionsList) {
    return positionsList.filter((row) => {
      if (!row.office || row.office !== nodeData.office) return false;

      if (nodeType === 'unit') {
        return (
          row.division === nodeData.division &&
          row.section === nodeData.section &&
          row.unit === nodeData.unit
        );
      } else if (nodeType === 'section') {
        return (
          row.division === nodeData.division &&
          row.section === nodeData.section &&
          (!row.unit || row.unit === '')
        );
      } else if (nodeType === 'division') {
        return (
          row.division === nodeData.division &&
          (!row.section || row.section === '') &&
          (!row.unit || row.unit === '')
        );
      } else if (nodeType === 'office') {
        return (
          (!row.division || row.division === '') &&
          (!row.section || row.section === '') &&
          (!row.unit || row.unit === '')
        );
      }
      return false;
    }).length;
  }

  const generateTreeStructure = (items, officeName) => {
    if (!items.length) return [];

    const positionsList = props.positions;

    const divisions = new Map();

    items.forEach((item) => {
      if (!item.division) return;
      if (!divisions.has(item.division)) {
        divisions.set(item.division, {
          sections: new Map(),
        });
      }
      const division = divisions.get(item.division);

      if (item.section) {
        if (!division.sections.has(item.section)) {
          division.sections.set(item.section, {
            units: new Map(),
          });
        }
        const section = division.sections.get(item.section);

        if (item.unit) {
          if (!section.units.has(item.unit)) {
            section.units.set(item.unit, {});
          }
        }
      }
    });

    const rootNode = {
      id: 'office-' + uid(),
      label: officeName,
      nodeType: 'office',
      data: { office: officeName },
      positions: countPositionsForNode('office', { office: officeName }, positionsList),
      children: [],
    };

    divisions.forEach((divisionData, divisionName) => {
      const divisionNode = {
        id: 'division-' + uid(),
        label: divisionName,
        nodeType: 'division',
        data: { office: officeName, division: divisionName },
        positions: countPositionsForNode(
          'division',
          { office: officeName, division: divisionName },
          positionsList,
        ),
        children: [],
      };

      divisionData.sections.forEach((sectionData, sectionName) => {
        const sectionNode = {
          id: 'section-' + uid(),
          label: sectionName,
          nodeType: 'section',
          data: { office: officeName, division: divisionName, section: sectionName },
          positions: countPositionsForNode(
            'section',
            { office: officeName, division: divisionName, section: sectionName },
            positionsList,
          ),
          children: [],
        };

        sectionData.units.forEach((unitData, unitName) => {
          const unitNode = {
            id: 'unit-' + uid(),
            label: unitName,
            nodeType: 'unit',
            data: {
              office: officeName,
              division: divisionName,
              section: sectionName,
              unit: unitName,
            },
            positions: countPositionsForNode(
              'unit',
              { office: officeName, division: divisionName, section: sectionName, unit: unitName },
              positionsList,
            ),
          };

          sectionNode.children.push(unitNode);
        });

        divisionNode.children.push(sectionNode);
      });

      rootNode.children.push(divisionNode);
    });

    return [rootNode];
  };
  //   const router = useRouter();
  const usePlantilla = usePlantillaStore();
  const selectedValue = ref(null);
  const filteredOptions = ref([]);
  const officeData = ref([]);
  const selectedNode = ref(null);
  const selectedNodeData = ref(null);

  const emit = defineEmits(['structure-selected']);

  const getOptions = () => {
    return filteredOptions.value || [];
  };

  const getUniqueValues = () => {
    if (!officeData.value.length) return [];
    const values = new Set();

    officeData.value.forEach((office) => {
      if (office.office) values.add(office.office);
    });

    return Array.from(values).sort();
  };

  const filterOptions = (val, update) => {
    if (usePlantilla.loading) return;

    update(() => {
      const needle = val.toLowerCase();
      filteredOptions.value = getUniqueValues().filter((v) => v.toLowerCase().includes(needle));
    });
  };

  const structureTree = computed(() => {
    if (!selectedValue.value || !officeData.value.length) return [];

    const officeItems = officeData.value.filter((item) => item.office === selectedValue.value);

    return generateTreeStructure(officeItems, selectedValue.value);
  });


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
<style scoped>
  .custom-tree .selected-node {
    background-color: #00b03527;
    color: black;
    border-radius: 4px;
  }
</style>
