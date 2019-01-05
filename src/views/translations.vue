<template>
    <div>
        <div class="container">
            <h2>Translations</h2>
            <hr>
            <br>
            <form>
                <div class="form-row">
                    <div class="col-2">
                        <label for="country_selection">Country</label>
                        <select class="form-control" id="country_selection" v-model="country">
                            <option v-for="country in countries" :value="country" v-bind:key="country">{{country}}
                            </option>
                        </select>
                    </div>
                    <div class="col-2">
                        <label for="lang_selection">Language</label>
                        <select class="form-control" id="lang_selection" v-model="lang" v-on:change="updateTable">
                            <option v-for="(language, index) in languages" :value="language" v-bind:key="index">
                                {{language}}
                            </option>
                        </select>
                    </div>
                </div>
            </form>
            <br>
            <div class="form-group">
                <input type="text" class="form-control" id="filter" placeholder="Search Translations" v-model="filter" v-on:keyup="updateTable">
            </div>
            <table class="table table-hover">
                <thead class="thead-dark">
                <tr>
                    <th scope="col">Key</th>
                    <th scope="col">Text</th>
                    <th scope="col">Language</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-bind:key="td" v-for="td in tableData">
                    <td>{{td.key}}</td>
                    <th>{{td.text}}</th>
                    <td>{{td.lang}}</td>
                    <td>
                        <a href="#" class="badge badge-dark">edit</a>
                        <a href="#" class="badge badge-success">Translate To...</a>
                        <a href="#" class="badge badge-danger">Delete</a>
                        </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    // @ is an alias to /src

    export default {
        name: 'translations',
        data() {
            return {
                tableData: [],
                library_tableData: [],
                country: "",
                lang: "",
                filter: "",
                countriesAndLanguages: Object,
            }
        },
        computed: {
            locale: function() {
                return this.country + "-" + this.lang
            },
            countries: function() {
                return Object.keys(this.countriesAndLanguages)
            },
            languages: function() {
                return this.countriesAndLanguages[this.country];
            }
        },
        beforeCreate() {
            this.axios.get('http://localhost:5000/list_countries').then(res => {
                this.countriesAndLanguages = res.data;
            })
        },
        methods: {
            updateTable: function () {

                this.axios.get('http://localhost:5000/' + this.locale, ).then(res => {
                    var translations = [];

                    var translationKeys = this.flattenObject(res.data);

                    Object.keys(translationKeys).forEach(key => {
                        var translation = {key: "", text: "", lang: ""};
                        let newTrans = translation;
                        newTrans.key = key;
                        newTrans.text = translationKeys[key];
                        newTrans.lang = this.lang;
                        if(this.filter !== ""){
                            if (newTrans.key.toLowerCase().indexOf(this.filter) !== -1 || newTrans.text.toLowerCase().indexOf(this.filter) !== -1){
                                translations.push(newTrans)
                            }
                        } else {
                            translations.push(newTrans)
                        }

                    })
                    this.tableData = translations;
                })
            },
            flattenObject: function(data){
                var result = {};
                function recurse (cur, prop) {
                    if (Object(cur) !== cur) {
                        result[prop] = cur;
                    } else if (Array.isArray(cur)) {
                        for(var i=0, l=cur.length; i<l; i++)
                            recurse(cur[i], prop + "[" + i + "]");
                        if (l == 0)
                            result[prop] = [];
                    } else {
                        var isEmpty = true;
                        for (var p in cur) {
                            isEmpty = false;
                            recurse(cur[p], prop ? prop+"."+p : p);
                        }
                        if (isEmpty && prop)
                            result[prop] = {};
                    }
                }
                recurse(data, "");
                return result;
            }
        }
    }
</script>
<style>
</style>
