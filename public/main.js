/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 2014/12/24
 * Time: 下午 10:53
 * To change this template use File | Settings | File Templates.
 */

require.config({
    paths: {
        /* Note the `delayStartupUntil=configured` parameter */
        mathjax: "http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML&amp;delayStartupUntil=configured"
       ,colliders:"./bower_components/threex.colliders/threex.colliders"
       ,colliderHelper:"./bower_components/threex.colliders/threex.colliderhelper"
    },

    shim: {
        mathjax: {
            exports: "MathJax",
            init: function () {
                MathJax.Hub.Config({
                    HTML: ["input/TeX","output/HTML-CSS"],
                    TeX: { extensions: ["AMSmath.js","AMSsymbols.js"],
                        equationNumbers: { autoNumber: "AMS" } },
                    extensions: ["tex2jax.js"],
                    jax: ["input/TeX","output/HTML-CSS"],
                    tex2jax: { inlineMath: [ ['$','$'], ["\\(","\\)"] ],
                        displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
                        processEscapes: true },
                    "HTML-CSS": { availableFonts: ["TeX"],
                        linebreaks: { automatic: true } }
                });
                MathJax.Hub.Startup.onload();
                return MathJax;
            }
        }
    }
});

require(['mathjax'
    //, 'three_world7th'
    ,'rect_Dialog7th','colliders','colliderHelper'
    , 'bower_components/threex.minecraft/package.require.js'
    , 'bower_components/threex.montainsarena/package.require.js'
    , 'bower_components/threex.daynight/package.require.js'
    , 'bower_components/threex.htmlmixer/package.require.js'     //未用到
    , 'bower_components/threex.windowresize/package.require.js'  //未用到
    , 'bower_components/threex.tvset/package.require.js'         //未用到
    , 'bower_components/threex.domevents/threex.domevents.js'    //未用到
    , 'bower_components/threex.domevents/threex.linkify.js'      //未用到
    , 'bower_components/threex.text/package.require.js'          //未用到
    , 'bower_components/threex.md2character/package.require.js'
    , 'bower_components/threex.romemodelsWG2nd/package.requireWG.js'
  ], function(){

    showQuestion()
    WG()

})
