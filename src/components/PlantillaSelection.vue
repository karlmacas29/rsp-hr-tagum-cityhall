<template>
    <div class="q-pa-md">
        <q-breadcrumbs separator=">" class="text-grey">
            <!-- City Hall Office (always shown) -->
            <q-breadcrumbs-el class="breadcrumb-item">
                <q-select outlined v-model="selectedValues[0]" :options="getOptionsForLevel(0)" :label="levels[0]"
                    use-input hide-selected fill-input input-debounce="300"
                    @filter="(val, update) => filterOptions(val, update, 0)" @update:model-value="handleSelection(0)"
                    style="min-width: 200px;" class="q-ml-sm q-mr-sm">
                    <template v-slot:no-option>
                        <q-item>
                            <q-item-section class="text-grey">No results</q-item-section>
                        </q-item>
                    </template>
                </q-select>
            </q-breadcrumbs-el>

            <!-- Dynamically render remaining levels based on availability -->
            <template v-for="(level, index) in levels.slice(1)" :key="index + 1">
                <q-breadcrumbs-el v-if="shouldShowLevel(index + 1)" class="breadcrumb-item">
                    <q-select outlined v-model="selectedValues[index + 1]" :options="getOptionsForLevel(index + 1)"
                        :label="level" use-input hide-selected fill-input input-debounce="300"
                        @filter="(val, update) => filterOptions(val, update, index + 1)"
                        @update:model-value="handleSelection(index + 1)" style="min-width: 200px;"
                        class="q-ml-sm q-mr-sm">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">No results</q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                </q-breadcrumbs-el>
            </template>
        </q-breadcrumbs>

        <div class="q-mt-lg">
            <p class="text-bold">{{ getSelectedPath() }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'OfficeBreadcrumbs',
    data() {
        return {
            levels: [
                'City Hall Office',
                '2nd Office',
                'Group Office',
                'Office Division',
                'Office Section',
                'Office Unit',
                'Office Position'
            ],
            selectedValues: [null, null, null, null, null, null, null],
            // Sample office hierarchy data
            officeData: [
                {
                    cityHallOffice: 'Main City Hall',
                    secondOffice: 'Administration',
                    groupOffice: 'HR Department',
                    officeDivision: 'Recruitment',
                    officeSection: 'Technical Hiring',
                    officeUnit: 'IT Specialists',
                    officePosition: 'Senior IT Recruiter'
                },
                {
                    cityHallOffice: 'Main City Hall',
                    secondOffice: 'Administration',
                    groupOffice: 'HR Department',
                    officeDivision: 'Recruitment',
                    officeSection: 'Technical Hiring',
                    officeUnit: 'IT Specialists',
                    officePosition: 'Junior IT Recruiter'
                },
                {
                    cityHallOffice: 'Main City Hall',
                    secondOffice: 'Administration',
                    groupOffice: 'HR Department',
                    officeDivision: 'Payroll',
                    officeSection: 'Compensation',
                    officeUnit: 'Benefits',
                    officePosition: 'Benefits Coordinator'
                },
                {
                    cityHallOffice: 'Main City Hall',
                    secondOffice: 'Administration',
                    groupOffice: 'Finance',
                    officeDivision: 'Budget',
                    officeSection: 'Planning',
                    officeUnit: 'Annual Forecasts',
                    officePosition: 'Budget Analyst'
                },
                {
                    cityHallOffice: 'Main City Hall',
                    secondOffice: 'Administration',
                    groupOffice: 'Finance',
                    officeDivision: 'Accounting',
                    officeSection: null,
                    officeUnit: 'Accounts Payable',
                    officePosition: 'AP Specialist'
                },
                {
                    cityHallOffice: 'Main City Hall',
                    secondOffice: 'Public Works',
                    groupOffice: 'Infrastructure',
                    officeDivision: 'Roads',
                    officeSection: 'Maintenance',
                    officeUnit: 'Repairs',
                    officePosition: 'Road Engineer'
                },
                {
                    cityHallOffice: 'Main City Hall',
                    secondOffice: 'Public Works',
                    groupOffice: 'Infrastructure',
                    officeDivision: 'Roads',
                    officeSection: 'Planning',
                    officeUnit: null,
                    officePosition: 'Urban Planner'
                },
                {
                    cityHallOffice: 'Main City Hall',
                    secondOffice: 'Public Works',
                    groupOffice: 'Parks',
                    officeDivision: 'Maintenance',
                    officeSection: null,
                    officeUnit: 'Landscaping',
                    officePosition: 'Gardener'
                },
                {
                    cityHallOffice: 'Main City Hall',
                    secondOffice: 'Public Safety',
                    groupOffice: null,
                    officeDivision: 'Emergency Services',
                    officeSection: 'Dispatch',
                    officeUnit: 'Call Center',
                    officePosition: 'Dispatcher'
                },
                {
                    cityHallOffice: 'Downtown Office',
                    secondOffice: null,
                    groupOffice: 'Permits',
                    officeDivision: 'Building Permits',
                    officeSection: 'Residential',
                    officeUnit: 'Single Family',
                    officePosition: 'Permit Specialist'
                },
                {
                    cityHallOffice: 'Downtown Office',
                    secondOffice: null,
                    groupOffice: 'Permits',
                    officeDivision: 'Building Permits',
                    officeSection: 'Commercial',
                    officeUnit: 'Retail',
                    officePosition: 'Senior Inspector'
                },
                {
                    cityHallOffice: 'Downtown Office',
                    secondOffice: null,
                    groupOffice: 'Licensing',
                    officeDivision: 'Business Licenses',
                    officeSection: 'New Applications',
                    officeUnit: null,
                    officePosition: 'License Specialist'
                },
                {
                    cityHallOffice: 'West Branch',
                    secondOffice: 'Community Services',
                    groupOffice: 'Recreation',
                    officeDivision: 'Youth Programs',
                    officeSection: 'After School',
                    officeUnit: 'Arts',
                    officePosition: 'Program Coordinator'
                },
                {
                    cityHallOffice: 'West Branch',
                    secondOffice: 'Community Services',
                    groupOffice: 'Recreation',
                    officeDivision: 'Adult Programs',
                    officeSection: 'Fitness',
                    officeUnit: 'Classes',
                    officePosition: 'Fitness Instructor'
                },
                {
                    cityHallOffice: 'West Branch',
                    secondOffice: 'Community Services',
                    groupOffice: 'Social Services',
                    officeDivision: 'Housing Assistance',
                    officeSection: 'Applications',
                    officeUnit: 'Eligibility',
                    officePosition: 'Case Manager'
                },
                {
                    cityHallOffice: 'East Branch',
                    secondOffice: 'Health Department',
                    groupOffice: 'Public Health',
                    officeDivision: 'Immunizations',
                    officeSection: 'Clinics',
                    officeUnit: 'Mobile',
                    officePosition: 'Nurse Practitioner'
                },
                {
                    cityHallOffice: 'East Branch',
                    secondOffice: 'Health Department',
                    groupOffice: 'Public Health',
                    officeDivision: 'Food Safety',
                    officeSection: 'Restaurant Inspections',
                    officeUnit: null,
                    officePosition: 'Health Inspector'
                },
                {
                    cityHallOffice: 'East Branch',
                    secondOffice: 'Health Department',
                    groupOffice: 'Mental Health',
                    officeDivision: 'Counseling',
                    officeSection: 'Youth',
                    officeUnit: 'Crisis Intervention',
                    officePosition: 'Licensed Counselor'
                },
                {
                    cityHallOffice: 'North District',
                    secondOffice: 'Planning',
                    groupOffice: 'Development',
                    officeDivision: 'Zoning',
                    officeSection: 'Applications',
                    officeUnit: 'Residential',
                    officePosition: 'Zoning Specialist'
                },
                {
                    cityHallOffice: 'North District',
                    secondOffice: 'Planning',
                    groupOffice: 'Development',
                    officeDivision: 'Zoning',
                    officeSection: 'Appeals',
                    officeUnit: null,
                    officePosition: 'Appeals Officer'
                },
                {
                    cityHallOffice: 'South District',
                    secondOffice: 'Transportation',
                    groupOffice: 'Public Transit',
                    officeDivision: 'Bus Operations',
                    officeSection: 'Scheduling',
                    officeUnit: 'Route Planning',
                    officePosition: 'Transit Planner'
                },
                {
                    cityHallOffice: 'South District',
                    secondOffice: 'Transportation',
                    groupOffice: 'Public Transit',
                    officeDivision: 'Light Rail',
                    officeSection: 'Maintenance',
                    officeUnit: 'Mechanical',
                    officePosition: 'Rail Technician'
                },
                {
                    cityHallOffice: 'South District',
                    secondOffice: 'Transportation',
                    groupOffice: 'Traffic',
                    officeDivision: 'Signals',
                    officeSection: null,
                    officeUnit: 'Installation',
                    officePosition: 'Signal Technician'
                },
                {
                    cityHallOffice: 'Historic District',
                    secondOffice: 'Cultural Affairs',
                    groupOffice: 'Arts',
                    officeDivision: 'Public Art',
                    officeSection: 'Installations',
                    officeUnit: 'Maintenance',
                    officePosition: 'Art Conservator'
                },
                {
                    cityHallOffice: 'Historic District',
                    secondOffice: 'Cultural Affairs',
                    groupOffice: 'Arts',
                    officeDivision: 'Events',
                    officeSection: 'Festivals',
                    officeUnit: 'Planning',
                    officePosition: 'Event Coordinator'
                },
                {
                    cityHallOffice: 'Historic District',
                    secondOffice: 'Cultural Affairs',
                    groupOffice: 'Heritage',
                    officeDivision: 'Preservation',
                    officeSection: 'Historical Buildings',
                    officeUnit: 'Renovation Permits',
                    officePosition: 'Preservation Specialist'
                },
                {
                    cityHallOffice: 'Waterfront Office',
                    secondOffice: 'Marine',
                    groupOffice: 'Harbor',
                    officeDivision: 'Docks',
                    officeSection: 'Commercial',
                    officeUnit: 'Fishing',
                    officePosition: 'Dock Master'
                },
                {
                    cityHallOffice: 'Waterfront Office',
                    secondOffice: 'Marine',
                    groupOffice: 'Harbor',
                    officeDivision: 'Docks',
                    officeSection: 'Recreational',
                    officeUnit: 'Moorage',
                    officePosition: 'Harbor Assistant'
                },
                {
                    cityHallOffice: 'Waterfront Office',
                    secondOffice: 'Marine',
                    groupOffice: 'Safety',
                    officeDivision: 'Inspections',
                    officeSection: 'Vessels',
                    officeUnit: null,
                    officePosition: 'Marine Inspector'
                },
                {
                    cityHallOffice: 'Airport Office',
                    secondOffice: 'Administration',
                    groupOffice: 'Operations',
                    officeDivision: 'Ground Services',
                    officeSection: 'Maintenance',
                    officeUnit: 'Facilities',
                    officePosition: 'Facilities Manager'
                }
            ],
            filteredOptions: [[], [], [], [], [], [], []]
        };
    },
    mounted() {
        // Initialize the first level options
        this.filteredOptions[0] = this.getUniqueValues(0);
    },
    methods: {
        // Get field name based on level index
        getFieldName(index) {
            const fieldMap = [
                'cityHallOffice',
                'secondOffice',
                'groupOffice',
                'officeDivision',
                'officeSection',
                'officeUnit',
                'officePosition'
            ];
            return fieldMap[index];
        },

        // Get unique values for a specific level
        getUniqueValues(level) {
            const fieldName = this.getFieldName(level);
            const values = new Set();

            // Filter based on previous selections
            let filteredData = [...this.officeData];

            // Only apply filter for previous selections that exist
            for (let i = 0; i < level; i++) {
                if (this.selectedValues[i] !== null) {
                    const prevField = this.getFieldName(i);
                    filteredData = filteredData.filter(office =>
                        office[prevField] === this.selectedValues[i]
                    );
                }
            }

            // Get unique values for current level
            filteredData.forEach(office => {
                if (office[fieldName] !== null) {
                    values.add(office[fieldName]);
                }
            });

            return Array.from(values).sort();
        },

        // Check if this level should be shown
        shouldShowLevel(index) {
            // Can't show any level if first level (City Hall Office) isn't selected
            if (index > 0 && !this.selectedValues[0]) {
                return false;
            }

            // For levels after the first, we need to ensure:
            // 1. Either the previous level is selected, OR
            // 2. We've determined the previous level has no options but we need to check this level

            // If this level has no options, don't show it
            const options = this.getUniqueValues(index);
            this.filteredOptions[index] = options;
            if (options.length === 0) {
                return false;
            }

            // For levels 2 and higher, we need to check if all previous levels are either:
            // - Selected (has a value), OR
            // - Should be skipped (has no options)
            for (let i = 0; i < index; i++) {
                // If a previous level has options but no selection, we can't show this level yet
                if (this.getUniqueValues(i).length > 0 && this.selectedValues[i] === null) {
                    return false;
                }
            }

            return true;
        },

        // Filter options based on user input
        filterOptions(val, update, index) {
            if (val === '') {
                update(() => {
                    this.filteredOptions[index] = this.getUniqueValues(index);
                });
                return;
            }

            update(() => {
                const needle = val.toLowerCase();
                this.filteredOptions[index] = this.getUniqueValues(index).filter(
                    v => v.toLowerCase().indexOf(needle) > -1
                );
            });
        },

        // Handle selection change
        handleSelection(index) {
            // Reset all subsequent selections
            for (let i = index + 1; i < this.levels.length; i++) {
                this.selectedValues[i] = null;
            }

            // Update options for all remaining levels
            for (let i = index + 1; i < this.levels.length; i++) {
                this.filteredOptions[i] = this.getUniqueValues(i);
            }
        },

        // Get options for a specific level
        getOptionsForLevel(index) {
            return this.filteredOptions[index] || [];
        },

        // Get the selected path as a string
        getSelectedPath() {
            return this.selectedValues
                .filter(val => val !== null)
                .join(' > ');
        }
    }
};
</script>

<style scoped>
.breadcrumb-item {
    display: inline-block;
    margin-right: 8px;
}
</style>