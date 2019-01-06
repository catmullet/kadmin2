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
                    <th scope="col" style="text-align: right" align="right"><button class="btn btn-success" data-toggle="modal" data-target="#AddTranslationModal">+ Add Translation</button></th>
                </tr>
                </thead>
                <tbody>
                <tr v-bind:key="index" v-for="(td, index) in tableData" v-on:click="updateSelectedKey(td.key)">
                    <td>{{td.key}}</td>
                    <th>{{td.text}}</th>
                    <td>{{td.lang}}</td>
                    <td style="text-align: right">
                        <a href="#" class="badge badge-success" data-toggle="modal" data-target="#TranslateToModal" v-on:click="translate_country = ''; translate_language = ''; previewText = '';">Translate To...</a>
                        <a href="#" class="badge badge-danger" data-toggle="modal" data-target="#DeleteModal">Delete</a>
                        </td>
                </tr>
                </tbody>
            </table>
        </div>

        <!-- Delete Modal -->
        <div class="modal fade" id="DeleteModal" tabindex="-1" role="dialog" aria-labelledby="DeleteModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="DeleteModalLabel">Permanently delete Translation Key</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <strong>Warning!</strong> This could disrupt current web content if still active.
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-danger" data-dismiss="modal" v-on:click="deleteTranslationKey()">Delete</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Translation Modal -->
        <div class="modal fade" id="AddTranslationModal" tabindex="-1" role="dialog" aria-labelledby="AddTranslationModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="AddTranslationModalLabel">Add Translation Key for <strong>{{locale}}</strong></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div v-if="country !== '' && lang !== ''">
                        <form>
                            <div class="row">
                                <div class="col">
                                    <input id="key_one" type="text" class="form-control" v-model="key_one" placeholder="ex. ui">
                                </div>
                                <div class="col">
                                    <input id="key_two" type="text" class="form-control" v-model="key_two" placeholder="ex. button">
                                </div>
                                <div class="col">
                                    <input id="key_three" type="text" class="form-control" v-model="key_three" placeholder="ex. info">
                                </div>
                            </div>
                            <br>
                            <div class="form-group">
                                <label for="translation_text">Translation Text</label>
                                <textarea class="form-control" id="translation_text" rows="3" v-model="key_text" placeholder="This is the the text for the translation."></textarea>
                            </div>
                        </form>
                        </div>
                        <div v-else>
                            <strong>Required</strong> Select a country and language first.
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <div v-if="country !== '' && lang !== ''">
                            <button type="button" class="btn btn-success" data-dismiss="modal" v-on:click="addTranslationKey()">Add</button>
                        </div>
                        <div v-else>
                            <button type="button" class="btn btn-block" disabled>Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Translate Modal -->
        <div class="modal fade" id="TranslateToModal" tabindex="-1" role="dialog" aria-labelledby="TranslateToModalModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="TranslateToModalModalLabel">Translate To</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div v-if="country !== '' && lang !== ''">
                            <form>
                                <div class="form-inline">
                                    <div class="form-group mb-2">
                                        <label for="country_selection" style="padding-right:15px;">Country </label>
                                        <select class="form-control" id="translate_country_selection" v-model="translate_country">
                                            <option v-for="country in countries" :value="country" v-bind:key="country">{{country}}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="form-group mx-sm-3 mb-2">
                                        <label for="lang_selection" style="padding-right:15px;">Language </label>
                                        <select class="form-control" id="translate_lang_selection" v-model="translate_language" v-on:change="PreviewTranslationKey">
                                            <option v-for="(language, index) in languages" :value="language" v-bind:key="index">
                                                {{language}}
                                            </option>
                                        </select>
                                    </div>
                                    </div>
                                <br>
                                <div class="form-group" v-if="this.previewText !== ''">
                                    <label for="preview_text">Translates to... </label>
                                    <textarea id="preview_text" class="form-control" v-model="previewText" rows="3" style="width:100%"></textarea>
                                </div>
                            </form>
                        </div>
                        <div v-else>
                            <strong>Required</strong> Select a country and language first.
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <div v-if="country !== '' && lang !== ''">
                            <button type="button" class="btn btn-success" data-dismiss="modal" v-on:click="TranslateTranslationKey()">Translate</button>
                        </div>
                        <div v-else>
                            <button type="button" class="btn btn-block" disabled>Translate</button>
                        </div>
                    </div>
                </div>
            </div>
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
                selectedKey: "",
                countriesAndLanguages: Object,
                key_one: "",
                key_two: "",
                key_three: "",
                key_text: "",
                translate_country: "",
                translate_language: "",
                previewText: ""
            }
        },
        computed: {
            add_key: function() {
                return this.key_one + "." + this.key_two + "." + this.key_three;
            },
            locale: function() {
                return this.country + "-" + this.lang
            },
            targetLocale: function() {
                return this.translate_country + "-" + this.translate_language
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
            updateSelectedKey: function(key) {
                this.selectedKey = key;
            },
            updateTable: function () {
                this.axios.get('http://localhost:5000/' + this.locale, ).then(res => {
                    let translations = [];

                    let translationKeys = this.flattenObject(res.data);

                    Object.keys(translationKeys).forEach(key => {
                        let newTrans = {key: "", text: "", lang: ""};
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

                    });
                    this.tableData = translations;
                })
            },
            deleteTranslationKey: function() {
                this.axios.post('http://localhost:5000/delete', {
                        'key': this.selectedKey,
                        'locale': this.locale
                    }
                ).then(res => {
                    if(res.status == 200) {
                        this.updateTable();
                    }
                });
            },
            addTranslationKey: function() {
                this.axios.post('http://localhost:5000/add', {
                        'key': this.add_key,
                        'translation': this.key_text,
                        'locale': this.locale
                    }
                ).then(res => {
                    if(res.status == 200) {
                        this.updateTable();
                    }
                });
            },
            PreviewTranslationKey: function() {
                this.axios.post('http://localhost:5000/translate', {
                        'key': this.selectedKey,
                        'source_locale': this.locale,
                        'target_locale': this.targetLocale,
                        'text': "",
                        'create_key': false
                    }
                ).then(res => {
                    if(res.status == 200) {
                        this.previewText = res.data;
                    }
                });
            },
            TranslateTranslationKey: function() {
                this.axios.post('http://localhost:5000/translate', {
                    'key': this.selectedKey,
                    'source_locale': this.locale,
                    'target_locale': this.targetLocale,
                    'text': this.previewText,
                    'create_key': true
                    }
                ).then(res => {
                    if(res.status == 200) {
                        this.updateTable();
                    }
                });
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
