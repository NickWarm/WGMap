var THREEx	= THREEx	|| {}

THREEx.RomeModels		= {}
THREEx.RomeModels.baseUrl	= '../'

THREEx.RomeModels.load	= function(url, callback){
	var options	= {
		smoothShading	: true,
		morphColors	: true,
	}
	var loaderMore = new THREE.JSONLoader();
	//loaderMore.load(url,)  //錯誤的想法


	var loader	= new THREE.JSONLoader();
	loader.load( url, function(geometry, material){
		//////////////////////////////////////////////////////////////////////////////////
		//		Comment								//
		//////////////////////////////////////////////////////////////////////////////////
		var material	= new THREE.MeshPhongMaterial({
			morphTargets	: true
		})

		//////////////////////////////////////////////////////////////////////////////////
		//		Comment								//
		//////////////////////////////////////////////////////////////////////////////////
		if( options.morphColors === true ){
			morphColorsToFaceColors(geometry)
			material.vertexColors	= THREE.FaceColors
		}
		if( options.smoothShading === true ){
			geometry.computeMorphNormals();
			material.shading	= THREE.SmoothShading
			material.morphNormals	= true
		}

		//////////////////////////////////////////////////////////////////////////////////
		//		Comment								//
		//////////////////////////////////////////////////////////////////////////////////
		var mesh	= new THREE.MorphAnimMesh( geometry, material );

		callback(mesh)
	} );
	
	/*
	//////////////////////////////////////////////////////////////////////////////////
	//自定義loading function，為了讓我們能控制model的位置，失敗，loader裡並沒有讓我們控制位置的方式
	//////////////////////////////////////////////////////////////////////////////////
	loader.loadWG(url, function(geometry, material){
		//////////////////////////////////////////////////////////////////////////////////
		//		Comment
		//////////////////////////////////////////////////////////////////////////////////
		var material = new THREE.MeshPhongMaterial()
	});*/

	// utils funcitons
	function morphColorsToFaceColors( geometry ) {
		if ( geometry.morphColors && geometry.morphColors.length ) {
			var colorMap = geometry.morphColors[ 0 ];
			for ( var i = 0; i < colorMap.colors.length; i ++ ) {
				geometry.faces[ i ].color = colorMap.colors[ i ];
			}
		}
	}
}

//baseUrl定義在上面，THREEx.RomeModels.baseUrl	= '../'
THREEx.RomeModels.loadHorse	= function(callback){
	var url		= this.baseUrl + 'models/horse.js'
	this.load(url, function(mesh){
		mesh.scale.multiplyScalar(1/100)

		callback(mesh)
	})
}

THREEx.RomeModels.loadParrot	= function(callback){
	var url		= this.baseUrl + 'models/parrot.js'
	this.load(url, function(mesh){
		mesh.scale.multiplyScalar(1/100)

		callback(mesh)
	})
}

THREEx.RomeModels.loadFlamingo	= function(callback){
	var url		= this.baseUrl + 'models/flamingo.js'
	this.load(url, function(mesh){
		mesh.scale.multiplyScalar(1/100)

		callback(mesh)
	})
}


THREEx.RomeModels.loadStork	= function(callback){
	var url		= this.baseUrl + 'models/stork.js'
	this.load(url, function(mesh){
		mesh.scale.multiplyScalar(1/100)

		callback(mesh)
	})
}

//////////////////////////////////////////////////////////////////////////////////
// 自定義的，成功selector.html與basic.html都能用
//////////////////////////////////////////////////////////////////////////////////
THREEx.RomeModels.loadChowchow = function(callback){
	var url     = this.baseUrl + 'models/chowchow.js'
	this.load(url, function(mesh){
		mesh.scale.multiplyScalar(1/150)

		callback(mesh)
	})
}

THREEx.RomeModels.loadEagle = function(callback){
    var url     = this.baseUrl + 'models/eagle.js'
    this.load(url, function(mesh){
        mesh.scale.multiplyScalar(1/150)

        callback(mesh)
    })
}

THREEx.RomeModels.loadCow = function(callback){
    var url     = this.baseUrl + 'models/cow.js'
    this.load(url, function(mesh){
        mesh.scale.multiplyScalar(1/200)

        callback(mesh)
    })
}

THREEx.RomeModels.loadOwl = function(callback){
    var url     = this.baseUrl + 'models/owl.js'
    this.load(url, function(mesh){
        mesh.scale.multiplyScalar(1/100)

        callback(mesh)
    })
}

THREEx.RomeModels.loadElk = function(callback){
    var url     = this.baseUrl + 'models/elk.js'
    this.load(url, function(mesh){
        mesh.scale.multiplyScalar(1/100)

        callback(mesh)
    })
}

THREEx.RomeModels.loadHummingbird = function(callback){
    var url     = this.baseUrl + 'models/hummingbird.js'
    this.load(url, function(mesh){
        mesh.scale.multiplyScalar(1/100)

        callback(mesh)
    })
}

THREEx.RomeModels.loadParrot = function(callback){
    var url     = this.baseUrl + 'models/parrot.js'
    this.load(url, function(mesh){
        mesh.scale.multiplyScalar(1/100)

        callback(mesh)
    })
}

THREEx.RomeModels.loadDeer = function(callback){
    var url     = this.baseUrl + 'models/deer.js'
    this.load(url, function(mesh){
        mesh.scale.multiplyScalar(1/150)

        callback(mesh)
    })
}

THREEx.RomeModels.loadFox = function(callback){
    var url     = this.baseUrl + 'models/fox.js'
    this.load(url, function(mesh){
        mesh.scale.multiplyScalar(1/150)

        callback(mesh)
    })
}

THREEx.RomeModels.loadMountainlion = function(callback){
    var url     = this.baseUrl + 'models/mountainlion.js'
    this.load(url, function(mesh){
        mesh.scale.multiplyScalar(1/150)

        callback(mesh)
    })
}

THREEx.RomeModels.loadFlamingo = function(callback){
    var url     = this.baseUrl + 'models/flamingo.js'
    this.load(url, function(mesh){
        mesh.scale.multiplyScalar(1/250)

        callback(mesh)
    })
}

THREEx.RomeModels.loadSealRun = function(callback){
    var url     = this.baseUrl + 'models/sealRun.js'
    this.load(url, function(mesh){
        mesh.scale.multiplyScalar(1/150)

        callback(mesh)
    })
}
