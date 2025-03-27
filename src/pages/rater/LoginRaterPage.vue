<template>
    <div class="row" style="height: 100vh">
        <div class="col-6">
            <div class="">
                <q-img height="100vh" src="/img/background/tagumbg.jpg">
                    <div class="absolute-full text-subtitle2 flex flex-center">
                        <div class="column items-center justify-center">
                            <img src="/logo.png" alt="Tagum City Logo" class="logo" width="240px" />
                            <div class="text-h5 text-weight-bolder">Recruitment, Selection and Placement</div>
                            <div class="text-h6">Human Resources</div>
                        </div>
                    </div>
                </q-img>
            </div>
        </div>
        <div class="col-6">
            <div class="column items-center justify-center q-gutter-md" style="height: 100vh">
                <div class="row justify-start items-center q-ma-none" style="width: 380px">
                    <div>
                        <q-icon left size="6em" name="star_half" />
                    </div>
                    <div>
                        <div class="text-h4 text-bold q-ma-none">Login</div>
                        <div class="text-h6 q-ma-none">Hello Rater</div>
                    </div>
                </div>
                <div>
                    <form action="">
                        <div class="q-gutter-md" style="width: 400px">
                            <q-select outlined v-model="username" :options="options" label="Select Raters">
                                <template v-slot:option="scope">
                                    <q-item v-bind="scope.itemProps" :class="{ 'bg-grey-2': scope.selected }">
                                        <q-item-section>
                                            <q-item-label>{{ scope.opt.label }}</q-item-label>
                                            <q-item-label caption>{{ scope.opt.role }}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>
                        </div>
                    </form>
                </div>
                <div>
                    <q-btn @click="login" label="Login" color="primary" size="md" style="width: 200px" rounded />
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'LoginRater',
    data() {
        return {
            username: '',
            options: [
                { label: 'User A. User', role: 'HR Manager', value: 'opt1' },
                { label: 'User A. User', role: 'HR Manager', value: 'opt2' },
                { label: 'User A. User', role: 'HR Manager', value: 'opt3' },
                { label: 'User A. User', role: 'HR Manager', value: 'opt4' },
                { label: 'User A. User', role: 'HR Manager', value: 'opt5' },
            ]
        }
    },
    methods: {
        login() {
            console.log('Login Clicked')

        },

    }
}
</script>
