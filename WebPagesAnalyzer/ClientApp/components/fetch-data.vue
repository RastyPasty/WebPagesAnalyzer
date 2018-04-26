<template>
    <div>
        <h1>Words Frequency Rating</h1>

        <p v-if="!report"><em>Loading...</em></p>
        <v-data-table :headers="headers"
                      :items="report"
                      hide-actions
                      disable-initial-sort
                      class="elevation-1">
            <template slot="items" slot-scope="word">
                <td>{{ word.item.text }}</td>
                <td>{{ word.item.count }}</td>
            </template>
        </v-data-table>

    </div>
</template>
<script>
    import axios from 'axios';

    export default {
        data() {
            return {
                headers: [
                    { text: 'Text', sortable: true, value: 'text' },
                    { text: 'Frequency', value: 'count', align: 'center', sortable: true },
                ],
                report: [],
            }
        },
        methods: {
        },
        mounted() {
            axios.get('/api/report')
                .then((response) => {
                    this.report = response.data;
                });
        },
    };
</script>

<style>
    .elevation-1 td {
        vertical-align: middle !important;
    }

    .elevation-1 th {
        vertical-align: middle !important;
    }

</style>
