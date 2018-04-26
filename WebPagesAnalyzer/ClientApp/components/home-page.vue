<template>
    <div>
        <template>
            <v-form v-model="valid" class="url-form" ref="form" lazy-validation="" @submit.prevent="submit">
                <v-progress-linear :indeterminate="awaitingRequest" v-if="awaitingRequest"></v-progress-linear>
                <v-text-field label="Url"
                              v-model="url"
                              :rules="urlRules"
                              :counter="1000"
                              required=""></v-text-field>
                <v-btn @click="submit"
                       :disabled="!valid || awaitingRequest">
                    submit
                </v-btn>
                <v-btn @click="clear">clear</v-btn>
            </v-form>


            <v-alert type="success" :value="showSuccess">
                Data saved successfully!
            </v-alert>

            <v-alert type="error" :value="showError">
                An error occured during your request!
            </v-alert>
        </template>
    </div>
</template>
<script>
    import axios from 'axios';
    axios.defaults.headers.common.Accept = 'application/json';

    export default {
        data: () => ({
            valid: true,
            awaitingRequest: false,
            showSuccess: false,
            showError: false,
            url: '',
            urlRules: [
                v => !!v || 'Url is required',
                v => v.length <= 1000 || 'Url must be less than 1000 characters',
                v => /(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,63}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?/.test(v) || 'URL must be valid'
            ],
        }),
        methods: {
            submit() {
                if (this.$refs.form.validate()) {
                    this.awaitingRequest = true;
                    this.showSuccess = false;
                    this.showError = false;
                    var scope = this;
                    axios.post('/api/user', {
                        requestUrl: this.url
                    })
                        .then((response) => {
                            console.log(response);
                            this.awaitingRequest = false;
                            if (response.data) {
                                this.showSuccess = true;
                            }
                        })
                        .catch(function (reason) {
                            scope.awaitingRequest = false;
                            scope.showError = true;
                        });;
                }
            },
            clear() {
                this.$refs.form.reset()
            }
        }
    }
</script>
<style>
    .url-form {
        margin-bottom: 50px;
    }
</style>
