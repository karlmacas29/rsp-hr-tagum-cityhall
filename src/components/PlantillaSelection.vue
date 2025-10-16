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

      // Helper function to check if values match (treating null/undefined/empty as equivalent)
      const valuesMatch = (val1, val2) => {
        const normalize = (val) => (val === null || val === undefined || val === '' ? '' : val);
        return normalize(val1) === normalize(val2);
      };

      if (nodeType === 'unit') {
        return (
          valuesMatch(row.office2, nodeData.office2) &&
          valuesMatch(row.group, nodeData.group) &&
          valuesMatch(row.division, nodeData.division) &&
          valuesMatch(row.section, nodeData.section) &&
          valuesMatch(row.unit, nodeData.unit)
        );
      } else if (nodeType === 'section') {
        return (
          valuesMatch(row.office2, nodeData.office2) &&
          valuesMatch(row.group, nodeData.group) &&
          valuesMatch(row.division, nodeData.division) &&
          valuesMatch(row.section, nodeData.section) &&
          (!row.unit || row.unit === '')
        );
      } else if (nodeType === 'division') {
        return (
          valuesMatch(row.office2, nodeData.office2) &&
          valuesMatch(row.group, nodeData.group) &&
          valuesMatch(row.division, nodeData.division) &&
          (!row.section || row.section === '') &&
          (!row.unit || row.unit === '')
        );
      } else if (nodeType === 'group') {
        return (
          valuesMatch(row.office2, nodeData.office2) &&
          valuesMatch(row.group, nodeData.group) &&
          (!row.division || row.division === '') &&
          (!row.section || row.section === '') &&
          (!row.unit || row.unit === '')
        );
      } else if (nodeType === 'office2') {
        return (
          valuesMatch(row.office2, nodeData.office2) &&
          (!row.group || row.group === '') &&
          (!row.division || row.division === '') &&
          (!row.section || row.section === '') &&
          (!row.unit || row.unit === '')
        );
      } else if (nodeType === 'office') {
        return (
          (!row.office2 || row.office2 === '') &&
          (!row.group || row.group === '') &&
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

    // Create a flexible hierarchical structure
    const structure = {
      office2s: new Map(),
      directGroups: new Map(),
      directDivisions: new Map(),
      directSections: new Map(),
      directUnits: new Map(),
    };

    items.forEach((item) => {
      const hasOffice2 = item.office2 && item.office2 !== '';
      const hasGroup = item.group && item.group !== '';
      const hasDivision = item.division && item.division !== '';
      const hasSection = item.section && item.section !== '';
      const hasUnit = item.unit && item.unit !== '';

      if (hasOffice2) {
        // Item belongs to an office2
        if (!structure.office2s.has(item.office2)) {
          structure.office2s.set(item.office2, {
            groups: new Map(),
            directDivisions: new Map(),
            directSections: new Map(),
            directUnits: new Map(),
          });
        }
        const office2 = structure.office2s.get(item.office2);

        if (hasGroup) {
          // Group under office2
          if (!office2.groups.has(item.group)) {
            office2.groups.set(item.group, {
              divisions: new Map(),
              directSections: new Map(),
              directUnits: new Map(),
            });
          }
          const group = office2.groups.get(item.group);

          if (hasDivision) {
            // Division under group
            if (!group.divisions.has(item.division)) {
              group.divisions.set(item.division, {
                sections: new Map(),
                directUnits: new Map(),
              });
            }
            const division = group.divisions.get(item.division);

            if (hasSection) {
              // Section under division
              if (!division.sections.has(item.section)) {
                division.sections.set(item.section, {
                  units: new Map(),
                });
              }
              const section = division.sections.get(item.section);

              if (hasUnit) {
                // Unit under section
                section.units.set(item.unit, {});
              }
            } else if (hasUnit) {
              // Unit directly under division (no section)
              division.directUnits.set(item.unit, {});
            }
          } else if (hasSection) {
            // Section directly under group (no division)
            if (!group.directSections.has(item.section)) {
              group.directSections.set(item.section, {
                units: new Map(),
              });
            }
            const section = group.directSections.get(item.section);

            if (hasUnit) {
              // Unit under section
              section.units.set(item.unit, {});
            }
          } else if (hasUnit) {
            // Unit directly under group (no division, no section)
            group.directUnits.set(item.unit, {});
          }
        } else if (hasDivision) {
          // Division directly under office2 (no group)
          if (!office2.directDivisions.has(item.division)) {
            office2.directDivisions.set(item.division, {
              sections: new Map(),
              directUnits: new Map(),
            });
          }
          const division = office2.directDivisions.get(item.division);

          if (hasSection) {
            // Section under division
            if (!division.sections.has(item.section)) {
              division.sections.set(item.section, {
                units: new Map(),
              });
            }
            const section = division.sections.get(item.section);

            if (hasUnit) {
              // Unit under section
              section.units.set(item.unit, {});
            }
          } else if (hasUnit) {
            // Unit directly under division (no section)
            division.directUnits.set(item.unit, {});
          }
        } else if (hasSection) {
          // Section directly under office2 (no group, no division)
          if (!office2.directSections.has(item.section)) {
            office2.directSections.set(item.section, {
              units: new Map(),
            });
          }
          const section = office2.directSections.get(item.section);

          if (hasUnit) {
            // Unit under section
            section.units.set(item.unit, {});
          }
        } else if (hasUnit) {
          // Unit directly under office2 (no group, no division, no section)
          office2.directUnits.set(item.unit, {});
        }
      } else if (hasGroup) {
        // Group directly under office (no office2)
        if (!structure.directGroups.has(item.group)) {
          structure.directGroups.set(item.group, {
            divisions: new Map(),
            directSections: new Map(),
            directUnits: new Map(),
          });
        }
        const group = structure.directGroups.get(item.group);

        if (hasDivision) {
          // Division under group
          if (!group.divisions.has(item.division)) {
            group.divisions.set(item.division, {
              sections: new Map(),
              directUnits: new Map(),
            });
          }
          const division = group.divisions.get(item.division);

          if (hasSection) {
            // Section under division
            if (!division.sections.has(item.section)) {
              division.sections.set(item.section, {
                units: new Map(),
              });
            }
            const section = division.sections.get(item.section);

            if (hasUnit) {
              // Unit under section
              section.units.set(item.unit, {});
            }
          } else if (hasUnit) {
            // Unit directly under division (no section)
            division.directUnits.set(item.unit, {});
          }
        } else if (hasSection) {
          // Section directly under group (no division)
          if (!group.directSections.has(item.section)) {
            group.directSections.set(item.section, {
              units: new Map(),
            });
          }
          const section = group.directSections.get(item.section);

          if (hasUnit) {
            // Unit under section
            section.units.set(item.unit, {});
          }
        } else if (hasUnit) {
          // Unit directly under group (no division, no section)
          group.directUnits.set(item.unit, {});
        }
      } else if (hasDivision) {
        // Division directly under office (no office2, no group)
        if (!structure.directDivisions.has(item.division)) {
          structure.directDivisions.set(item.division, {
            sections: new Map(),
            directUnits: new Map(),
          });
        }
        const division = structure.directDivisions.get(item.division);

        if (hasSection) {
          // Section under division
          if (!division.sections.has(item.section)) {
            division.sections.set(item.section, {
              units: new Map(),
            });
          }
          const section = division.sections.get(item.section);

          if (hasUnit) {
            // Unit under section
            section.units.set(item.unit, {});
          }
        } else if (hasUnit) {
          // Unit directly under division (no section)
          division.directUnits.set(item.unit, {});
        }
      } else if (hasSection) {
        // Section directly under office (no office2, no group, no division)
        if (!structure.directSections.has(item.section)) {
          structure.directSections.set(item.section, {
            units: new Map(),
          });
        }
        const section = structure.directSections.get(item.section);

        if (hasUnit) {
          // Unit under section
          section.units.set(item.unit, {});
        }
      } else if (hasUnit) {
        // Unit directly under office (no office2, no group, no division, no section)
        structure.directUnits.set(item.unit, {});
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

    // Helper function to create unit nodes
    const createUnitNode = (unitName, parentData) => ({
      id: 'unit-' + uid(),
      label: unitName,
      nodeType: 'unit',
      data: { ...parentData, unit: unitName },
      positions: countPositionsForNode('unit', { ...parentData, unit: unitName }, positionsList),
    });

    // Helper function to create section nodes
    const createSectionNode = (sectionName, parentData, sectionData) => {
      const sectionNode = {
        id: 'section-' + uid(),
        label: sectionName,
        nodeType: 'section',
        data: { ...parentData, section: sectionName },
        positions: countPositionsForNode(
          'section',
          { ...parentData, section: sectionName },
          positionsList,
        ),
        children: [],
      };

      // Add units under section
      sectionData.units.forEach((_, unitName) => {
        sectionNode.children.push(createUnitNode(unitName, sectionNode.data));
      });

      return sectionNode;
    };

    // Helper function to create division nodes
    const createDivisionNode = (divisionName, parentData, divisionData) => {
      const divisionNode = {
        id: 'division-' + uid(),
        label: divisionName,
        nodeType: 'division',
        data: { ...parentData, division: divisionName },
        positions: countPositionsForNode(
          'division',
          { ...parentData, division: divisionName },
          positionsList,
        ),
        children: [],
      };

      // Add sections under division
      divisionData.sections.forEach((sectionData, sectionName) => {
        divisionNode.children.push(createSectionNode(sectionName, divisionNode.data, sectionData));
      });

      // Add direct units under division
      divisionData.directUnits.forEach((_, unitName) => {
        divisionNode.children.push(createUnitNode(unitName, divisionNode.data));
      });

      return divisionNode;
    };

    // Helper function to create group nodes
    const createGroupNode = (groupName, parentData, groupData) => {
      const groupNode = {
        id: 'group-' + uid(),
        label: groupName,
        nodeType: 'group',
        data: { ...parentData, group: groupName },
        positions: countPositionsForNode(
          'group',
          { ...parentData, group: groupName },
          positionsList,
        ),
        children: [],
      };

      // Add divisions under group
      groupData.divisions.forEach((divisionData, divisionName) => {
        groupNode.children.push(createDivisionNode(divisionName, groupNode.data, divisionData));
      });

      // Add direct sections under group
      groupData.directSections.forEach((sectionData, sectionName) => {
        groupNode.children.push(createSectionNode(sectionName, groupNode.data, sectionData));
      });

      // Add direct units under group
      groupData.directUnits.forEach((_, unitName) => {
        groupNode.children.push(createUnitNode(unitName, groupNode.data));
      });

      return groupNode;
    };

    // Add office2s and their children
    structure.office2s.forEach((office2Data, office2Name) => {
      const office2Node = {
        id: 'office2-' + uid(),
        label: office2Name,
        nodeType: 'office2',
        data: { office: officeName, office2: office2Name },
        positions: countPositionsForNode(
          'office2',
          { office: officeName, office2: office2Name },
          positionsList,
        ),
        children: [],
      };

      // Add groups under office2
      office2Data.groups.forEach((groupData, groupName) => {
        office2Node.children.push(createGroupNode(groupName, office2Node.data, groupData));
      });

      // Add direct divisions under office2
      office2Data.directDivisions.forEach((divisionData, divisionName) => {
        office2Node.children.push(createDivisionNode(divisionName, office2Node.data, divisionData));
      });

      // Add direct sections under office2
      office2Data.directSections.forEach((sectionData, sectionName) => {
        office2Node.children.push(createSectionNode(sectionName, office2Node.data, sectionData));
      });

      // Add direct units under office2
      office2Data.directUnits.forEach((_, unitName) => {
        office2Node.children.push(createUnitNode(unitName, office2Node.data));
      });

      rootNode.children.push(office2Node);
    });

    // Add direct groups (under office, no office2)
    structure.directGroups.forEach((groupData, groupName) => {
      rootNode.children.push(createGroupNode(groupName, { office: officeName }, groupData));
    });

    // Add direct divisions (under office, no office2, no group)
    structure.directDivisions.forEach((divisionData, divisionName) => {
      rootNode.children.push(
        createDivisionNode(divisionName, { office: officeName }, divisionData),
      );
    });

    // Add direct sections (under office, no office2, no group, no division)
    structure.directSections.forEach((sectionData, sectionName) => {
      rootNode.children.push(createSectionNode(sectionName, { office: officeName }, sectionData));
    });

    // Add direct units (under office, no office2, no group, no division, no section)
    structure.directUnits.forEach((_, unitName) => {
      rootNode.children.push(createUnitNode(unitName, { office: officeName }));
    });

    return [rootNode];
  };

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

  // Get appropriate icon for node type
  const getNodeIcon = (node) => {
    const iconMap = {
      office: 'business',
      office2: 'business', // Same icon as office
      group: 'account_tree',
      division: 'corporate_fare',
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
