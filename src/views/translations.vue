<template>
    <div>
        <div class="container">
            <h2>Translations</h2>
            <hr>
            <br>
            <div class="card">
                <div class="card-body">
            <form>
                <div class="form-row align-items-center">
                <div class="col-2">
                    <div class="btn-group btn-group-toggle" data-toggle="buttons">
                        <label class="btn btn-secondary active" v-on:click="countryLanguageToggle = true">
                            <input autocomplete="off" checked id="option1" name="options" type="radio"> Pick
                        </label>
                        <label class="btn btn-secondary" v-on:click="countryLanguageToggle = false">
                            <input autocomplete="off" id="option3" name="options" type="radio"> New Country/Lanuage
                        </label>
                    </div>
                </div>
                </div>
                <br>
                <div class="form-row align-items-center">
                    <div class="col-2" v-if="countryLanguageToggle">
                        <label for="country_selection">Country</label>
                        <select class="form-control" id="country_selection" v-model="country" v-on:change="lang = ''">
                            <option :value="country" v-bind:key="country" v-for="country in countries">{{country}}
                            </option>
                        </select>
                    </div>
                    <div class="col-2" v-else>
                        <label for="custom_country">Country</label>
                        <input class="form-control" id="custom_country" placeholder="country" type="text" v-model="country">
                    </div>
                    <div class="col-2" v-if="countryLanguageToggle">
                        <label for="lang_selection">Language</label>
                        <select class="form-control" id="lang_selection" v-model="lang" v-on:change="updateTable">
                            <option :value="language" v-bind:key="index" v-for="(language, index) in languages">
                                {{language}}
                            </option>
                        </select>
                    </div>
                    <div class="col-2" v-else>
                        <label for="custom_lang">Language</label>
                        <input class="form-control" id="custom_lang" placeholder="language" type="text" v-model="lang">
                    </div>
                </div>
            </form>
        </div>
    </div>
            <br>
            <div class="card">
            <div class="card-body">
            <div class="form-group">
                <input class="form-control" id="filter" placeholder="Filter Translations" type="text" v-model="filter" v-on:keyup="updateTable">
            </div>
            <table class="table table-hover">
                <thead class="thead-dark">
                <tr>
                    <th scope="col">Key</th>
                    <th scope="col">Text</th>
                    <th scope="col">Language</th>
                    <th align="right" scope="col" style="text-align: right">
                        <button class="btn btn-sm btn-success" data-target="#AddTranslationModal" data-toggle="modal" v-on:click="key_one = ''; key_two = ''; key_three = ''; key_text = '';">+ Add Translation</button>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-bind:key="index" v-for="(td, index) in tableData" v-on:click="updateSelectedKey(td.key)">
                    <td>{{td.key}}</td>
                    <th>{{td.text}}</th>
                    <td>{{td.lang}}</td>
                    <td style="text-align: right">
                        <a class="badge badge-primary" data-target="#TranslateToModal" data-toggle="modal" href="#" style="border-bottom-right-radius: 0; border-top-right-radius: 0" v-on:click="translate_country = ''; translate_language = ''; previewText = '';">Translate To...</a>
                        <a class="badge badge-danger" data-target="#DeleteModal" data-toggle="modal" href="#" style="border-bottom-left-radius: 0; border-top-left-radius: 0">Delete</a>
                        </td>
                </tr>
                </tbody>
            </table>
            </div>
            </div>
            <div style="padding-top: 60px;" v-if="rawTranslations !== '' && locale.length == 5">
            <br>
                <h5>Response Preview for <strong>{{"http://localhost:5000/" + locale}}</strong></h5>
            <textarea class="form-control" rows="20" style="width: 100%;" v-model="rawTranslations"></textarea>
            </div>
        </div>

        <!-- Delete Modal -->
        <div aria-hidden="true" aria-labelledby="DeleteModalLabel" class="modal" id="DeleteModal" role="dialog" tabindex="-1">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="DeleteModalLabel">Permanently delete Translation Key</h5>
                        <button aria-label="Close" class="close" data-dismiss="modal" type="button">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <strong>Warning!</strong> This could disrupt current web content if still active.
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-dismiss="modal" type="button">Close</button>
                        <button class="btn btn-danger" data-dismiss="modal" type="button" v-on:click="deleteTranslationKey()">Delete</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Translation Modal -->
        <div aria-hidden="true" aria-labelledby="AddTranslationModalLabel" class="modal" id="AddTranslationModal" role="dialog" tabindex="-1">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="AddTranslationModalLabel">Add Translation Key for <strong>{{locale}}</strong></h5>
                        <button aria-label="Close" class="close" data-dismiss="modal" type="button">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div v-if="country !== '' && lang !== ''">
                        <form>
                            <div class="row">
                                <div class="col">
                                    <input class="form-control" id="key_one" placeholder="ex. ui" type="text" v-model="key_one">
                                </div>
                                <div class="col">
                                    <input class="form-control" id="key_two" placeholder="ex. button" type="text" v-model="key_two">
                                </div>
                                <div class="col">
                                    <input class="form-control" id="key_three" placeholder="ex. info" type="text" v-model="key_three">
                                </div>
                            </div>
                            <br>
                            <div class="form-group">
                                <label for="translation_text">Translation Text</label>
                                <textarea class="form-control" id="translation_text" placeholder="This is the the text for the translation key." rows="3" v-model="key_text"></textarea>
                            </div>
                        </form>
                        </div>
                        <div v-else>
                            <strong>(Required)</strong> Select a country and language first.
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-dismiss="modal" type="button">Close</button>
                        <div v-if="country !== '' && lang !== ''">
                            <button class="btn btn-success" data-dismiss="modal" type="button" v-on:click="addTranslationKey()">Add</button>
                        </div>
                        <div v-else>
                            <button class="btn btn-block" disabled type="button">Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Translate Modal -->
        <div aria-hidden="true" aria-labelledby="TranslateToModalModalLabel" class="modal" id="TranslateToModal" role="dialog" tabindex="-1">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="TranslateToModalModalLabel">Translate To</h5>
                        <button aria-label="Close" class="close" data-dismiss="modal" type="button">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div v-if="country !== '' && lang !== ''">
                            <form>
                                <div class="form-inline">
                                    <div class="form-group mb-2">
                                        <label for="country_selection" style="padding-right:15px;">Country </label>
                                        <select class="form-control" id="translate_country_selection" v-model="translate_country" v-on:change="translate_language = ''">
                                            <option :value="country" v-bind:key="country" v-for="country in countries">{{country}}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="form-group mx-sm-3 mb-2">
                                        <label for="lang_selection" style="padding-right:15px;">Language </label>
                                        <select class="form-control" id="translate_lang_selection" v-model="translate_language" v-on:change="PreviewTranslationKey">
                                            <option :value="language" v-bind:key="index" v-for="(language, index) in translate_languages">
                                                {{language}}
                                            </option>
                                        </select>
                                    </div>
                                    </div>
                                <br>
                                <div class="form-group" v-if="this.previewText !== ''">
                                    <label for="preview_text">Translates to... </label>
                                    <textarea class="form-control" id="preview_text" rows="3" style="width:100%" v-model="previewText"></textarea>
                                </div>
                            </form>
                        </div>
                        <div v-else>
                            <strong>Required</strong> Select a country and language first.
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-dismiss="modal" type="button">Close</button>
                        <div v-if="country !== '' && lang !== ''">
                            <button class="btn btn-success" data-dismiss="modal" type="button" v-on:click="TranslateTranslationKey()">Translate</button>
                        </div>
                        <div v-else>
                            <button class="btn btn-block" disabled type="button">Translate</button>
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
                previewText: "",
                rawTranslations: {},
                countryLanguageToggle: true
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
            },
            translate_languages: function() {
                return this.countriesAndLanguages[this.translate_country];
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
                if (this.locale.length == 5) {
                    this.axios.get('http://localhost:5000/' + this.locale,).then(res => {
                        let translations = [];
                        this.rawTranslations = JSON.stringify(res.data, undefined, 4);
                        let translationKeys = this.flattenObject(res.data);

                        Object.keys(translationKeys).forEach(key => {
                            let newTrans = {key: "", text: "", lang: ""};
                            newTrans.key = key;
                            newTrans.text = translationKeys[key];
                            newTrans.lang = this.lang;
                            if (this.filter !== "") {
                                if (newTrans.key.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1 || newTrans.text.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1) {
                                    translations.push(newTrans)
                                }
                            } else {
                                translations.push(newTrans)
                            }

                        });
                        this.tableData = translations;
                    })
                }
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
                    } else {
                        this.previewText = ""
                    }
                }).catch(e => {
                    console.log(e);
                    this.previewText = ""
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
