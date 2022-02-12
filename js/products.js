// ESM載入
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'yuchi-hexschool';

let productModal = {};
let deleteProductModal = {};

// vue
createApp({
    data() {
        return {
            apiUrl: apiUrl,
            apiPath: apiPath,
            products: [],
            isNew: false,
            tempProduct: {
                imagesUrl: []
            }
        }
    },
    methods: {
        checkLogin() {
            const url = `${this.apiUrl}/api/user/check`;
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            axios.defaults.headers.common['Authorization'] = token;

            axios.post(url)
                .then(res => {
                    this.getData()
                })
                .catch(err => {
                    alert(err.data.message);
                    window.location = 'index.html';
                })
        },
        getData() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/all`;
            axios.get(url)
                .then(res => {
                    this.products = res.data.products;
                })
        },
        openModal(status, product) {
            if( status === 'isNew' ) {
                
                this.tempProduct = { imagesUrl: [] }; // 初始化
                this.isNew = true;
                productModal.show();

            }else if( status === 'edit' ) {
                
                this.tempProduct = { ...product }; // 產品資料
                this.isNew = false;
                productModal.show();

            }else if( status === 'delete' ) {
                
                this.tempProduct = { ...product }; // 產品資料
                deleteProductModal.show();

            }
        },
        updateProduct() {
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let method = 'post';

            if(!this.isNew) {
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
                method = 'put';
            }

            axios[method](url, { data: this.tempProduct })
            .then(res => {
                this.getData();
                productModal.hide()
            })
        },
        deleteProduct(){
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
            let method = 'delete';

            axios[method](url)
            .then(res => {
                this.getData();
                deleteProductModal.hide();
            })
        },
        createImages() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        }
    },
    mounted() {
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false
        });

        deleteProductModal = new bootstrap.Modal(document.getElementById('deleteProductModal'), {
            keyboard: false
        });

        this.checkLogin();
    },
}).mount('#app');