<template>

    <v-navigation-drawer permanent="">
        <v-toolbar flat="">
            <v-list>
                <v-list-tile>
                    <v-list-tile-title class="title">
                        Menu
                    </v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-toolbar>
        <v-list dense="" class="pt-0">
            <v-list-tile v-for="item in items"
                         :key="item.title"
                        @click=""
                        :to="item.path">
                <v-list-tile-action>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
    import { routes } from '../routes'
    export default {
    data () {
    return {
    items: [
    { title: 'Add page', icon: 'add_to_queue', path: '/' },
    { title: 'Report', icon: 'receipt', path: '/fetch-data' }
    ],
    right: null
    }
    }
    }
</script>

<style>
    .slide-enter-active, .slide-leave-active {
    transition: max-height .35s
    }
    .slide-enter, .slide-leave-to {
    max-height: 0px;
    }

    .slide-enter-to, .slide-leave {
    max-height: 20em;
    }
</style>
