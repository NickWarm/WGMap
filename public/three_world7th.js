/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 2014/12/24
 * Time: 下午 11:04
 * To change this template use File | Settings | File Templates.
 */
function WG(){
    //////////////////////////////////////////////////////////////////////////////
    //       start 3D world
    //////////////////////////////////////////////////////////////////////////////
    var renderer	= new THREE.WebGLRenderer({
        antialias	: true
    });
    renderer.setSize( window.innerWidth, window.innerHeight );

    // renderer.setSize( 256,256 );
    document.body.appendChild( renderer.domElement );

    var onRenderFcts= []
    var scene	= new THREE.Scene();
    var camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 30000 );
    // var camera	= new THREE.PerspectiveCamera(45, 256/256, 0.01, 1000 );
    camera.position.z = 2;

    //////////////////////////////////////////////////////////////////////////////////
    //		handle window resize
    //////////////////////////////////////////////////////////////////////////////////

    THREEx.WindowResize(renderer, camera)

    window.addEventListener('resize', function(event){
        mixerContext.rendererCSS.setSize( window.innerWidth, window.innerHeight )
    }, false)

    //////////////////////////////////////////////////////////////////////////////////
    //		set 3 point lighting
    //////////////////////////////////////////////////////////////////////////////////

    ;(function(){
        // add a ambient light
        var light	= new THREE.AmbientLight( 0x020202 )
        scene.add( light )
        // add a light in front
        var light	= new THREE.DirectionalLight('white', 1)
        light.position.set(0.5, 0.5, 2)
        scene.add( light )
        // add a light behind
        var light	= new THREE.DirectionalLight('white', 0.75)
        light.position.set(-0.5, -0.5, -2)
        scene.add( light )
    })()

    //////////////////////////////////////////////////////////////////////////////////
    //		加入colliderSystem							//
    //////////////////////////////////////////////////////////////////////////////////
    var colliderSystem	= new THREEx.ColliderSystem()
    onRenderFcts.push(function(){
        colliderSystem.notify()
    })

    //////////////////////////////////////////////////////////////////////////////////
    //		 sun
    //////////////////////////////////////////////////////////////////////////////////

    var sunAngle = Math.PI+Math.PI/2;
    onRenderFcts.push(function(delta, now){
        var dayDuration	= 20
        sunAngle	-= delta/dayDuration * Math.PI*2
    })

    //////////////////////////////////////////////////////////////////////////////////
    //		starfield							//
    //////////////////////////////////////////////////////////////////////////////////

    ;(function(){
        var starField	= new THREEx.DayNight.StarField()
        scene.add(starField.object3d)
        onRenderFcts.push(function(delta, now){
            starField.update(sunAngle)
        })
    })()

    //////////////////////////////////////////////////////////////////////////////////
    //		sunSphere							//
    //////////////////////////////////////////////////////////////////////////////////

    ;(function(){
        var sunSphere	= new THREEx.DayNight.SunSphere()
        scene.add( sunSphere.object3d )
        onRenderFcts.push(function(delta, now){
            sunSphere.update(sunAngle)
        })
    })()

    //////////////////////////////////////////////////////////////////////////////////
    //		directionalLight						//
    //////////////////////////////////////////////////////////////////////////////////

    ;(function(){
        var sunLight	= new THREEx.DayNight.SunLight()
        scene.add( sunLight.object3d )
        onRenderFcts.push(function(delta, now){
            sunLight.update(sunAngle)
        })
    })()

    //////////////////////////////////////////////////////////////////////////////////
    //		skydom								//
    //////////////////////////////////////////////////////////////////////////////////

    ;(function(){
        var skydom	= new THREEx.DayNight.Skydom()
        scene.add( skydom.object3d )
        onRenderFcts.push(function(delta, now){
            skydom.update(sunAngle)
        })
    })()

    //////////////////////////////////////////////////////////////////////////////////
    //		add the montains						//
    //////////////////////////////////////////////////////////////////////////////////

    ;(function(){
        THREEx.MontainsArena.defaultMaterial	= THREE.MeshPhongMaterial

        var mesh	= new THREEx.MontainsArena()
        mesh.scale.multiplyScalar(30)
        scene.add(mesh)

    })()

    //////////////////////////////////////////////////////////////////////////////////
    //		ground								//
    //////////////////////////////////////////////////////////////////////////////////

    ;(function(){
        var textureUrl	= 'images/grasslight-small.jpg';
        var texture	= THREE.ImageUtils.loadTexture(textureUrl);
        texture.wrapS	= THREE.RepeatWrapping;
        texture.wrapT	= THREE.RepeatWrapping;
        texture.repeat.x= 10
        texture.repeat.y= 10
        texture.anisotropy = 16;

        var geometry	= new THREE.CircleGeometry(30, 32)
        var material	= new THREE.MeshPhongMaterial({
            map	: texture
        })
        var mesh	= new THREE.Mesh(geometry, material)
        mesh.lookAt(new THREE.Vector3(0,1,0))
        scene.add(mesh)
    })()

    //////////////////////////////////////////////////////////////////////////////////
    //		threex.romemodelsWG2nd      　
    //////////////////////////////////////////////////////////////////////////////////

    ;(function(){

        THREEx.RomeModels.loadFlamingo(function(mesh){
            scene.add(mesh)
            onRenderFcts.push(function(delta, now){
                mesh.updateAnimation(delta*1000);
            })

            mesh.position.x	= -4                 //x 負：左邊   正：右邊
            mesh.position.y	= 0.8
            mesh.position.z = 1.8
            mesh.rotation.y	= Math.PI*2.2         //控制面向的方向

            //////////////////////////////////////////////////////////////////////////////////
            //      use collider
            //////////////////////////////////////////////////////////////////////////////////
            // init collider
            var collider	= THREEx.Collider.createFromObject3d(mesh)
            colliderSystem.add(collider)
            onRenderFcts.push(function(delta){
                collider.update()
            })

            collider.addEventListener('contactEnter', function(otherCollider){
                //console.log('contactEnter', collider.object3d.name, 'with', otherCollider.object3d.name)
                helper.material.color.set('red')

                //一接觸，開啟div，成功但還沒辦法處理一開始就默認"已接觸"
                var element	= document.querySelector('#question1')
                element.style.display	= element.style.display === 'none' ? 'block' : 'none'

            })
            collider.addEventListener('contactExit', function(otherCollider){
                //console.log('contactExit', collider.object3d.name, 'with', otherCollider.object3d.name)
                helper.material.color.set('green')
                var element	= document.querySelector('#question1')
                element.style.display	= element.style.display === 'none' ? 'block' : 'none'
            })

            // init collider helper                             //已確定可以把兩個helper都關掉
            var helper	= new THREEx.ColliderHelper(collider)
            helper.material.color.set('green')

            //////////////////////////////////////////////////////////////////////
            //          若不想看到collider的方框，那麼就不要把helper加入動畫的array裡面去即可
            //////////////////////////////////////////////////////////////////////
//            scene.add(helper)
//            onRenderFcts.push(function(delta){
//                helper.update()
//            })


        })

        THREEx.RomeModels.loadMountainlion(function(mesh){
            scene.add(mesh)
            onRenderFcts.push(function(delta, now){
                mesh.updateAnimation(delta*1000);
            })

            mesh.position.x	= -6                  //x 負：左邊   正：右邊
            mesh.position.y	= 0.5
            mesh.position.z = 2.5
            mesh.rotation.y	= Math.PI*2.2         //控制面向的方向

            //////////////////////////////////////////////////////////////////////////////////
            //      use collider
            //////////////////////////////////////////////////////////////////////////////////
            // init collider
            var collider	= THREEx.Collider.createFromObject3d(mesh)
            colliderSystem.add(collider)
            onRenderFcts.push(function(delta){
                collider.update()
            })

            collider.addEventListener('contactEnter', function(otherCollider){
                //console.log('contactEnter', collider.object3d.name, 'with', otherCollider.object3d.name)
                helper.material.color.set('red')

                //一接觸，開啟div，成功但還沒辦法處理一開始就默認"已接觸"
                var element	= document.querySelector('#question2')
                element.style.display	= element.style.display === 'none' ? 'block' : 'none'

            })
            collider.addEventListener('contactExit', function(otherCollider){
                //console.log('contactExit', collider.object3d.name, 'with', otherCollider.object3d.name)
                helper.material.color.set('green')
                var element	= document.querySelector('#question2')
                element.style.display	= element.style.display === 'none' ? 'block' : 'none'
            })

            // init collider helper                             //已確定可以把兩個helper都關掉
            var helper	= new THREEx.ColliderHelper(collider)
            helper.material.color.set('green')

            //////////////////////////////////////////////////////////////////////
            //          若不想看到collider的方框，那麼就不要把helper加入動畫的array裡面去即可
            //////////////////////////////////////////////////////////////////////
//            scene.add(helper)
//            onRenderFcts.push(function(delta){
//                helper.update()
//            })


        })

        THREEx.RomeModels.loadHummingbird(function(mesh){
            scene.add(mesh)
            onRenderFcts.push(function(delta, now){
                mesh.updateAnimation(delta*1000);
            })

            mesh.position.x	= -7                  //x 負：左邊   正：右邊
            mesh.position.y	= 0.5
            mesh.position.z = -1
            mesh.rotation.y	= Math.PI*2.4         //控制面向的方向

            //////////////////////////////////////////////////////////////////////////////////
            //      use collider
            //////////////////////////////////////////////////////////////////////////////////
            // init collider
            var collider	= THREEx.Collider.createFromObject3d(mesh)
            colliderSystem.add(collider)
            onRenderFcts.push(function(delta){
                collider.update()
            })

            collider.addEventListener('contactEnter', function(otherCollider){
                //console.log('contactEnter', collider.object3d.name, 'with', otherCollider.object3d.name)
                helper.material.color.set('red')

                //一接觸，開啟div，成功但還沒辦法處理一開始就默認"已接觸"
                var element	= document.querySelector('#question3')
                element.style.display	= element.style.display === 'none' ? 'block' : 'none'

            })
            collider.addEventListener('contactExit', function(otherCollider){
                //console.log('contactExit', collider.object3d.name, 'with', otherCollider.object3d.name)
                helper.material.color.set('green')
                var element	= document.querySelector('#question3')
                element.style.display	= element.style.display === 'none' ? 'block' : 'none'
            })

            // init collider helper                             //已確定可以把兩個helper都關掉
            var helper	= new THREEx.ColliderHelper(collider)
            helper.material.color.set('green')

            //////////////////////////////////////////////////////////////////////
            //          若不想看到collider的方框，那麼就不要把helper加入動畫的array裡面去即可
            //////////////////////////////////////////////////////////////////////
//            scene.add(helper)
//            onRenderFcts.push(function(delta){
//                helper.update()
//            })



        })

        THREEx.RomeModels.loadElk(function(mesh){
            scene.add(mesh)
            onRenderFcts.push(function(delta, now){
                mesh.updateAnimation(delta*1000);
            })

            mesh.position.x	= -5
            mesh.position.y	= 0.5
            mesh.position.z = -1
            mesh.rotation.y	= Math.PI*2.3

            //////////////////////////////////////////////////////////////////////////////////
            //      use collider
            //////////////////////////////////////////////////////////////////////////////////
            // init collider
            var collider	= THREEx.Collider.createFromObject3d(mesh)
            colliderSystem.add(collider)
            onRenderFcts.push(function(delta){
                collider.update()
            })

            collider.addEventListener('contactEnter', function(otherCollider){
                //console.log('contactEnter', collider.object3d.name, 'with', otherCollider.object3d.name)
                helper.material.color.set('red')

                //一接觸，開啟div，成功但還沒辦法處理一開始就默認"已接觸"
                var element	= document.querySelector('#question4')
                element.style.display	= element.style.display === 'none' ? 'block' : 'none'

            })
            collider.addEventListener('contactExit', function(otherCollider){
                //console.log('contactExit', collider.object3d.name, 'with', otherCollider.object3d.name)
                helper.material.color.set('green')
                var element	= document.querySelector('#question4')
                element.style.display	= element.style.display === 'none' ? 'block' : 'none'
            })

            // init collider helper                             //已確定可以把兩個helper都關掉
            var helper	= new THREEx.ColliderHelper(collider)
            helper.material.color.set('green')

            //////////////////////////////////////////////////////////////////////
            //          若不想看到collider的方框，那麼就不要把helper加入動畫的array裡面去即可
            //////////////////////////////////////////////////////////////////////
//            scene.add(helper)
//            onRenderFcts.push(function(delta){
//                helper.update()
//            })


        })

        THREEx.RomeModels.loadChowchow(function(mesh){
            scene.add(mesh)
            onRenderFcts.push(function(delta, now){
                mesh.updateAnimation(delta*1000);
            })

            mesh.position.x	= -3                //x 負：左邊   正：右邊
            mesh.position.y	= 0.5
            mesh.position.z = -1
            mesh.rotation.y	= Math.PI*2.2       //控制面向的方向

            //////////////////////////////////////////////////////////////////////////////////
            //      use collider
            //////////////////////////////////////////////////////////////////////////////////
            // init collider
            var collider	= THREEx.Collider.createFromObject3d(mesh)
            colliderSystem.add(collider)
            onRenderFcts.push(function(delta){
                collider.update()
            })

            collider.addEventListener('contactEnter', function(otherCollider){
                //console.log('contactEnter', collider.object3d.name, 'with', otherCollider.object3d.name)
                helper.material.color.set('red')

                //一接觸，開啟div，成功但還沒辦法處理一開始就默認"已接觸"
                var element	= document.querySelector('#question5')
                element.style.display	= element.style.display === 'none' ? 'block' : 'none'

            })
            collider.addEventListener('contactExit', function(otherCollider){
                //console.log('contactExit', collider.object3d.name, 'with', otherCollider.object3d.name)
                helper.material.color.set('green')
                var element	= document.querySelector('#question5')
                element.style.display	= element.style.display === 'none' ? 'block' : 'none'
            })

            // init collider helper                             //已確定可以把兩個helper都關掉
            var helper	= new THREEx.ColliderHelper(collider)
            helper.material.color.set('green')

            //////////////////////////////////////////////////////////////////////
            //          若不想看到collider的方框，那麼就不要把helper加入動畫的array裡面去即可
            //////////////////////////////////////////////////////////////////////
//            scene.add(helper)
//            onRenderFcts.push(function(delta){
//                helper.update()
//            })


        })

        THREEx.RomeModels.loadEagle(function(mesh){
            scene.add(mesh)
            onRenderFcts.push(function(delta, now){
                mesh.updateAnimation(delta*1000);
            })

            mesh.position.x	= -1
            mesh.position.y	= 1.3
            mesh.position.z = -1
            mesh.rotation.y	= Math.PI*2.1

            //////////////////////////////////////////////////////////////////////////////////
            //      use collider
            //////////////////////////////////////////////////////////////////////////////////
            // init collider
            var collider	= THREEx.Collider.createFromObject3d(mesh)
            colliderSystem.add(collider)
            onRenderFcts.push(function(delta){
                collider.update()
            })

            collider.addEventListener('contactEnter', function(otherCollider){
                //console.log('contactEnter', collider.object3d.name, 'with', otherCollider.object3d.name)
                helper.material.color.set('red')

                //一接觸，開啟div，成功但還沒辦法處理一開始就默認"已接觸"
                var element	= document.querySelector('#question6')
                element.style.display	= element.style.display === 'none' ? 'block' : 'none'

            })
            collider.addEventListener('contactExit', function(otherCollider){
                //console.log('contactExit', collider.object3d.name, 'with', otherCollider.object3d.name)
                helper.material.color.set('green')
                var element	= document.querySelector('#question6')
                element.style.display	= element.style.display === 'none' ? 'block' : 'none'
            })

            // init collider helper                             //已確定可以把兩個helper都關掉
            var helper	= new THREEx.ColliderHelper(collider)
            helper.material.color.set('green')

            //////////////////////////////////////////////////////////////////////
            //          若不想看到collider的方框，那麼就不要把helper加入動畫的array裡面去即可
            //////////////////////////////////////////////////////////////////////
//            scene.add(helper)
//            onRenderFcts.push(function(delta){
//                helper.update()
//            })


        })

        THREEx.RomeModels.loadCow(function(mesh){
            scene.add(mesh)
            onRenderFcts.push(function(delta, now){
                mesh.updateAnimation(delta*1000);
            })

            mesh.position.x	= 1
            mesh.position.y	= 0.5
            mesh.position.z = -1
            mesh.rotation.y	= Math.PI*1.9

            //////////////////////////////////////////////////////////////////////////////////
            //      use collider
            //////////////////////////////////////////////////////////////////////////////////
            // init collider
            var collider	= THREEx.Collider.createFromObject3d(mesh)
            colliderSystem.add(collider)
            onRenderFcts.push(function(delta){
                collider.update()
            })

            collider.addEventListener('contactEnter', function(otherCollider){
                //console.log('contactEnter', collider.object3d.name, 'with', otherCollider.object3d.name)
                helper.material.color.set('red')

                //一接觸，開啟div，成功但還沒辦法處理一開始就默認"已接觸"
                var element	= document.querySelector('#question7')
                element.style.display	= element.style.display === 'none' ? 'block' : 'none'

            })
            collider.addEventListener('contactExit', function(otherCollider){
                //console.log('contactExit', collider.object3d.name, 'with', otherCollider.object3d.name)
                helper.material.color.set('green')
                var element	= document.querySelector('#question7')
                element.style.display	= element.style.display === 'none' ? 'block' : 'none'
            })

            // init collider helper                             //已確定可以把兩個helper都關掉
            var helper	= new THREEx.ColliderHelper(collider)
            helper.material.color.set('green')

            //////////////////////////////////////////////////////////////////////
            //          若不想看到collider的方框，那麼就不要把helper加入動畫的array裡面去即可
            //////////////////////////////////////////////////////////////////////
//            scene.add(helper)
//            onRenderFcts.push(function(delta){
//                helper.update()
//            })
        })

        THREEx.RomeModels.loadOwl(function(mesh){
            scene.add(mesh)
            onRenderFcts.push(function(delta, now){
                mesh.updateAnimation(delta*1000);
            })

            mesh.position.x	= 3
            mesh.position.y	= 1.3
            mesh.position.z = -1
            mesh.rotation.y	= Math.PI*1.7

            //////////////////////////////////////////////////////////////////////////////////
            //      use collider
            //////////////////////////////////////////////////////////////////////////////////
            // init collider
            var collider	= THREEx.Collider.createFromObject3d(mesh)
            colliderSystem.add(collider)
            onRenderFcts.push(function(delta){
                collider.update()
            })

            collider.addEventListener('contactEnter', function(otherCollider){
                //console.log('contactEnter', collider.object3d.name, 'with', otherCollider.object3d.name)
                helper.material.color.set('red')

                //一接觸，開啟div，成功但還沒辦法處理一開始就默認"已接觸"
                var element	= document.querySelector('#question8')
                element.style.display	= element.style.display === 'none' ? 'block' : 'none'

            })
            collider.addEventListener('contactExit', function(otherCollider){
                //console.log('contactExit', collider.object3d.name, 'with', otherCollider.object3d.name)
                helper.material.color.set('green')
                var element	= document.querySelector('#question8')
                element.style.display	= element.style.display === 'none' ? 'block' : 'none'
            })

            // init collider helper                             //已確定可以把兩個helper都關掉
            var helper	= new THREEx.ColliderHelper(collider)
            helper.material.color.set('green')

            //////////////////////////////////////////////////////////////////////
            //          若不想看到collider的方框，那麼就不要把helper加入動畫的array裡面去即可
            //////////////////////////////////////////////////////////////////////
//            scene.add(helper)
//            onRenderFcts.push(function(delta){
//                helper.update()
//            })


        })

        THREEx.RomeModels.loadParrot(function(mesh){
            scene.add(mesh)
            onRenderFcts.push(function(delta, now){
                mesh.updateAnimation(delta*1000);
            })

            mesh.position.x	= 5                  //x 負：左邊   正：右邊
            mesh.position.y	= 1.0
            mesh.position.z = -0.4
            mesh.rotation.y	= Math.PI*1.6         //控制面向的方向

            //////////////////////////////////////////////////////////////////////////////////
            //      use collider
            //////////////////////////////////////////////////////////////////////////////////
            // init collider
            var collider	= THREEx.Collider.createFromObject3d(mesh)
            colliderSystem.add(collider)
            onRenderFcts.push(function(delta){
                collider.update()
            })

            collider.addEventListener('contactEnter', function(otherCollider){
                //console.log('contactEnter', collider.object3d.name, 'with', otherCollider.object3d.name)
                helper.material.color.set('red')

                //一接觸，開啟div，成功但還沒辦法處理一開始就默認"已接觸"
                var element	= document.querySelector('#question9')
                element.style.display	= element.style.display === 'none' ? 'block' : 'none'

            })
            collider.addEventListener('contactExit', function(otherCollider){
                //console.log('contactExit', collider.object3d.name, 'with', otherCollider.object3d.name)
                helper.material.color.set('green')
                var element	= document.querySelector('#question9')
                element.style.display	= element.style.display === 'none' ? 'block' : 'none'
            })

            // init collider helper                             //已確定可以把兩個helper都關掉
            var helper	= new THREEx.ColliderHelper(collider)
            helper.material.color.set('green')

            //////////////////////////////////////////////////////////////////////
            //          若不想看到collider的方框，那麼就不要把helper加入動畫的array裡面去即可
            //////////////////////////////////////////////////////////////////////
//            scene.add(helper)
//            onRenderFcts.push(function(delta){
//                helper.update()
//            })


        })

        THREEx.RomeModels.loadDeer(function(mesh){
            scene.add(mesh)
            onRenderFcts.push(function(delta, now){
                mesh.updateAnimation(delta*1000);
            })

            mesh.position.x	= 4.5                 //x 負：左邊   正：右邊
            mesh.position.y	= 0.5
            mesh.position.z = 2.5
            mesh.rotation.y	= Math.PI*1.8         //控制面向的方向

            //////////////////////////////////////////////////////////////////////////////////
            //      use collider
            //////////////////////////////////////////////////////////////////////////////////
            // init collider
            var collider	= THREEx.Collider.createFromObject3d(mesh)
            colliderSystem.add(collider)
            onRenderFcts.push(function(delta){
                collider.update()
            })

            collider.addEventListener('contactEnter', function(otherCollider){
                //console.log('contactEnter', collider.object3d.name, 'with', otherCollider.object3d.name)
                helper.material.color.set('red')

                //一接觸，開啟div，成功但還沒辦法處理一開始就默認"已接觸"
                var element	= document.querySelector('#question10')
                element.style.display	= element.style.display === 'none' ? 'block' : 'none'

            })
            collider.addEventListener('contactExit', function(otherCollider){
                //console.log('contactExit', collider.object3d.name, 'with', otherCollider.object3d.name)
                helper.material.color.set('green')
                var element	= document.querySelector('#question10')
                element.style.display	= element.style.display === 'none' ? 'block' : 'none'
            })

            // init collider helper                             //已確定可以把兩個helper都關掉
            var helper	= new THREEx.ColliderHelper(collider)
            helper.material.color.set('green')

            //////////////////////////////////////////////////////////////////////
            //          若不想看到collider的方框，那麼就不要把helper加入動畫的array裡面去即可
            //////////////////////////////////////////////////////////////////////
//            scene.add(helper)
//            onRenderFcts.push(function(delta){
//                helper.update()
//            })

        })

        THREEx.RomeModels.loadFox(function(mesh){
            scene.add(mesh)
            onRenderFcts.push(function(delta, now){
                mesh.updateAnimation(delta*1000);
            })

            mesh.position.x	= 3                 //x 負：左邊   正：右邊
            mesh.position.y	= 0.5
            mesh.position.z = 2.5
            mesh.rotation.y	= Math.PI*1.8         //控制面向的方向

            //////////////////////////////////////////////////////////////////////////////////
            //      use collider
            //////////////////////////////////////////////////////////////////////////////////
            // init collider
            var collider	= THREEx.Collider.createFromObject3d(mesh)
            colliderSystem.add(collider)
            onRenderFcts.push(function(delta){
                collider.update()
            })

            collider.addEventListener('contactEnter', function(otherCollider){
                //console.log('contactEnter', collider.object3d.name, 'with', otherCollider.object3d.name)
                helper.material.color.set('red')

                //一接觸，開啟div，成功但還沒辦法處理一開始就默認"已接觸"
                var element	= document.querySelector('#question11')
                element.style.display	= element.style.display === 'none' ? 'block' : 'none'

            })
            collider.addEventListener('contactExit', function(otherCollider){
                //console.log('contactExit', collider.object3d.name, 'with', otherCollider.object3d.name)
                helper.material.color.set('green')
                var element	= document.querySelector('#question11')
                element.style.display	= element.style.display === 'none' ? 'block' : 'none'
            })

            // init collider helper                             //已確定可以把兩個helper都關掉
            var helper	= new THREEx.ColliderHelper(collider)
            helper.material.color.set('green')

            //////////////////////////////////////////////////////////////////////
            //          若不想看到collider的方框，那麼就不要把helper加入動畫的array裡面去即可
            //////////////////////////////////////////////////////////////////////
//            scene.add(helper)
//            onRenderFcts.push(function(delta){
//                helper.update()
//            })



        })

        THREEx.RomeModels.loadSealRun(function(mesh){
            scene.add(mesh)
            onRenderFcts.push(function(delta, now){
                mesh.updateAnimation(delta*1000);
            })

            mesh.position.x	= 2                 //x 負：左邊   正：右邊
            mesh.position.y	= 0.5
            mesh.position.z = 2.8
            mesh.rotation.y	= Math.PI*1.8         //控制面向的方向

            //////////////////////////////////////////////////////////////////////////////////
            //      use collider
            //////////////////////////////////////////////////////////////////////////////////
            // init collider
            var collider	= THREEx.Collider.createFromObject3d(mesh)
            colliderSystem.add(collider)
            onRenderFcts.push(function(delta){
                collider.update()
            })

            collider.addEventListener('contactEnter', function(otherCollider){
                //console.log('contactEnter', collider.object3d.name, 'with', otherCollider.object3d.name)
                helper.material.color.set('red')

                //一接觸，開啟div，成功但還沒辦法處理一開始就默認"已接觸"
                var element	= document.querySelector('#question12')
                element.style.display	= element.style.display === 'none' ? 'block' : 'none'

            })
            collider.addEventListener('contactExit', function(otherCollider){
                //console.log('contactExit', collider.object3d.name, 'with', otherCollider.object3d.name)
                helper.material.color.set('green')
                var element	= document.querySelector('#question12')
                element.style.display	= element.style.display === 'none' ? 'block' : 'none'
            })

            // init collider helper                             //已確定可以把兩個helper都關掉
            var helper	= new THREEx.ColliderHelper(collider)
            helper.material.color.set('green')

            //////////////////////////////////////////////////////////////////////
            //          若不想看到collider的方框，那麼就不要把helper加入動畫的array裡面去即可
            //////////////////////////////////////////////////////////////////////
//            scene.add(helper)
//            onRenderFcts.push(function(delta){
//                helper.update()
//            })

        })

    })()



    //////////////////////////////////////////////////////////////////////////////////
    //	    Minecraft 人物model
    //////////////////////////////////////////////////////////////////////////////////

    THREEx.MinecraftChar.defaultMaterial	= THREE.MeshPhongMaterial

    var player	= new THREEx.MinecraftPlayer()

    player.character.root.rotation.y = Math.PI
    player.character.root.position.x = 0
    player.character.root.position.z = 5
    scene.add(player.character.root)
    onRenderFcts.push(function(delta, now){
        player.update(delta, now)
    })

    //////////////////////////////////////////////////////////////////////////////////
    //      use collider
    //////////////////////////////////////////////////////////////////////////////////

    // init collider
    var collider	= THREEx.Collider.createFromObject3d(player.character.root)
    colliderSystem.add(collider)
    onRenderFcts.push(function(delta){
        collider.update()
    })

    collider.addEventListener('contactEnter', function(otherCollider){
        console.log('contactEnter', collider.object3d.name, 'with', otherCollider.object3d.name)
        helper.material.color.set('red')  //原本：red   關掉，未成功



    })
    collider.addEventListener('contactExit', function(otherCollider){
        console.log('contactExit', collider.object3d.name, 'with', otherCollider.object3d.name)
        helper.material.color.set('green')  //原本：green    關掉，未成功



    })

    // init collider helper
    var helper	= new THREEx.ColliderHelper(collider)
    helper.material.color.set('green')  //原本：green   關掉，未成功

    //////////////////////////////////////////////////////////////////////
    //          若不想看到collider的方框，那麼就不要把helper加入動畫的array裡面去即可
    //////////////////////////////////////////////////////////////////////
//    scene.add(helper)
//    onRenderFcts.push(function(delta){
//        helper.update()
//    })


    //////////////////////////////////////////////////////////////////////////////////
    //    把camera固定在人物的後方
    //////////////////////////////////////////////////////////////////////////////////
    var cameraControlsDisabled	= false
    // keep the camera behind the player
    // - complex but html.mixer needs the camera to be at the world level
    onRenderFcts.push(function(delta){
        if( cameraControlsDisabled )	return

        var object3d	= player.character.root

        // set camera position
        var vector	= new THREE.Vector3(0, 1.2,-2);
        var matrix	= new THREE.Matrix4().makeRotationY(object3d.rotation.y);
        vector.applyMatrix4( matrix );
        var position	= object3d.position.clone().add(vector);
        camera.position.copy(position)

        // set camera lookAt
        var vector	= new THREE.Vector3(0, 1.2, 3);
        var matrix	= new THREE.Matrix4().makeRotationY(object3d.rotation.y);
        vector.applyMatrix4( matrix );
        var target	= object3d.position.clone().add(vector);
        camera.lookAt(target)
    })

    //////////////////////////////////////////////////////////////////////////////////
    //		controls.input based on keyboard				//
    //////////////////////////////////////////////////////////////////////////////////

    document.body.addEventListener('keydown', function(event){
        var input	= player.controls.input
        if( event.keyCode === 'W'.charCodeAt(0) )	input.up	= true
        if( event.keyCode === 'S'.charCodeAt(0) )	input.down	= true
        if( event.keyCode === 'A'.charCodeAt(0) )	input.left	= true
        if( event.keyCode === 'D'.charCodeAt(0) )	input.right	= true
        if( event.keyCode === 'Q'.charCodeAt(0) )	input.strafeLeft= true
        if( event.keyCode === 'E'.charCodeAt(0) )	input.strafeRight= true

        // to support arrows because tsate asked me :)
        if( event.keyCode === 38 )			input.up	= true
        if( event.keyCode === 40 )			input.down	= true
        if( event.keyCode === 37 && !event.shiftKey )	input.left	= true
        if( event.keyCode === 39 && !event.shiftKey )	input.right	= true
        if( event.keyCode === 37 &&  event.shiftKey )	input.strafeLeft= true
        if( event.keyCode === 39 &&  event.shiftKey )	input.strafeRight= true
    })
    document.body.addEventListener('keyup', function(event){
        var input	= player.controls.input

        // console.log(event.keyCode)

        if( event.keyCode === 'W'.charCodeAt(0) )	input.up	= false
        if( event.keyCode === 'S'.charCodeAt(0) )	input.down	= false
        if( event.keyCode === 'A'.charCodeAt(0) )	input.left	= false
        if( event.keyCode === 'D'.charCodeAt(0) )	input.right	= false
        if( event.keyCode === 'Q'.charCodeAt(0) )	input.strafeLeft= false
        if( event.keyCode === 'E'.charCodeAt(0) )	input.strafeRight= false

        // to support arrows because tsate asked me :)
        if( event.keyCode === 38 )			input.up	= false
        if( event.keyCode === 40 )			input.down	= false
        if( event.keyCode === 37 ||  event.shiftKey )	input.left	= false
        if( event.keyCode === 39 ||  event.shiftKey )	input.right	= false
        if( event.keyCode === 37 || !event.shiftKey )	input.strafeLeft= false
        if( event.keyCode === 39 || !event.shiftKey )	input.strafeRight= false
    })


    //////////////////////////////////////////////////////////////////////////////////
    //		render the scene						//
    //////////////////////////////////////////////////////////////////////////////////
    onRenderFcts.push(function(){
        renderer.render( scene, camera );
    })

    //////////////////////////////////////////////////////////////////////////////////
    //		loop runner							//
    //////////////////////////////////////////////////////////////////////////////////
    var lastTimeMsec= null
    requestAnimationFrame(function animate(nowMsec){
        // keep looping
        requestAnimationFrame( animate );
        // measure time
        lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
        var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
        lastTimeMsec	= nowMsec
        // call each update function
        onRenderFcts.forEach(function(onRenderFct){
            onRenderFct(deltaMsec/1000, nowMsec/1000)
        })
    })

}