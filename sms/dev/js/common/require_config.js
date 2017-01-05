requirejs.config({
    //urlArgs: 'v=2016120600',
    baseUrl: 'lib',
    paths: {
        'jquery': 'jquery/dist/jquery.min',
        'vue': 'vue/dist/vue.min',
        'config': '../js/common/config',
        'spinner': '../js/common/spinner',
        'ajax': '../js/common/ajax',
        'utilities': '../js/common/utilities',
        'swiper': '../js/common/swiper'
    },
    shim: {
        'ajax': 'spinner',
        'loadmore': 'vue'
    }
});