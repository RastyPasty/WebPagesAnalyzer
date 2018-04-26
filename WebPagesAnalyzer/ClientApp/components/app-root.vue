<template>
    <div id="app" class="container-fluid">
        
        <header class="section-head">
            <div class="container">
                <v-toolbar color="blue darken-4">                    
                        <h1>WebPages Analyzer</h1>                        
                </v-toolbar>
            </div>
        </header>
        <v-app light>
        <section style="padding-top: 90px">
            <div class="col-sm-2">
                <nav-menu params="route: route"></nav-menu>
            </div>
            <div class="col-sm-9" style="padding-top: 40px;">
                <router-view></router-view>
            </div>
        </section>
            </v-app>
        </div>   

</template>

<script>
import Vue from 'vue'
import FetchData from './fetch-data'
import HomePage from './home-page'
import NavMenu from './nav-menu'
    
Vue.component('fetch-data', FetchData);
Vue.component('home-page', HomePage);
Vue.component('nav-menu', NavMenu);

export default {
    data() {
        return {
        }
    }
}
</script>

<style>
    .section-head {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
    font-size: 1.7em;
    font-weight: 600;
    color: white;
    background: #0D47A1;
    box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);    
    }
    .section-head .toolbar {
box-shadow: none;
}
</style>
