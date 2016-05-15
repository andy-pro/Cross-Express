/* specific String helpers for EditVerticalController */
String.prototype.getCounter = function(re, i) {
	return this.replace(re, function(s,m) { return String(+m+i).frontZero(m.length); });
}
String.prototype.getComData = function(p1, p2, i) {
	return $.trim(this.getCounter(/%(\d+)/g, i)/*counters*/.replace(/%A/g, p1)/*actual common data*/.replace(/%M/g, p2))/*plint name*/;
}
/* end specific String helpers */

/*** ErrorController ***/
app.controllers.ErrorCtrl = function() {
	document.title = L._ERROR_;
	web2spa.loadHTML();
}
/* end ErrorController */

/*** UserController ***/
app.controllers.UserCtrl = function() {
	//document.title = L[$request.args[0]];   // login, logout, profile, change_password, register, request_reset_password
	//$request.json = false;
	//web2py_component(web2spa.compose_url($route.url), $route.target);	// as $.load, but provide form submit
	//console.log('user ctrl');

	//var action = $request.args[0] || 'login',
	var action = $request.args[0];
	if (action == 'logout') {
		//_.load();
		_.load({
			//url: 'user/info',
			data: true,
			onload: _.onLogOut
		});


	} else {
		if (action == 'login' || !action) _.modal.show('Log In', 'UserLoginTmpl');
		else if (action == 'register') _.modal.show(L._SIGN_UP_, 'UserRegisterTmpl');
		//_.render({ templateId: tmpl, targetEl: 'modal-body' });
		//$('.modal-title').text(title);
		//$('#modal-container').modal();
		var form = new Form({form: 'authform', safe: true});
	}
}
/* end UserController */

/*** CrossController ***/
app.controllers.CrossesCtrl = function() {
//console.log('crosses ctrl');

//blade.Runtime.loadTemplate("crosses.blade", function(err, tmpl) {

	//_.load({onload:function(data) {
		//if (data) {
			//tmpl(data, function(err, html) {
				//console.log(data);
				//$route.targetEl.html(html);
			//});
		//}
	//}});

//});

	if ($request.args[0]) $route.templateId = 'cross';
	_.load_and_render();

//console.log('scope');

	//if ($request.args[0]) $route.templateId = 'CrossTmpl';
	//console.log('reload cross ctrl, user is', $userId);
	//web2spa.load_and_render();
}
/* end CrossController */


/*** Cables Controller ***/
app.controllers.CablesCtrl = function() {

	function cablesSubmit() {
		var cables = [], cable, _c;
		cdata.forEach(function(_c) {
			title = _c.title.val();
			cable = {};
			try {
				if (_c.id) {
					cable._id = _c.id;
					if (_c.delete.is(':checked') || !title) { cable.delete = 'on'; throw false; }
					else throw true;
				} else if (title) throw true;
			} catch(e) {
				if (e) { cable.title = title; cable.details = _c.details.val(); cable.color = _c.clr; }
				cables.push(cable);
			}
		});
		$scope.formData = {};
		$scope.formData.cables = JSON.stringify(cables);
		//console.table(cables); console.log($scope.formData.cables); return false;
		return form.post();
	}

	function addCable(cable) {
		cable = new Cable(cable);
		cable.row.appendTo(tb);
		cdata.push(cable);
	}
console.log('cables ctrl ok!!!');
	var form, cdata, tb;
	//web2spa.load_and_render({doctitle:L._CABLES_}, function() {
	web2spa.load_and_render({doctitle:L._CABLES_}, function() {
		form = new Form({submit: cablesSubmit});
		cdata = [];
		tb = $('#cablebody');
		//for (var ci in $scope.cables) addCable(ci);
		$scope.cables.forEach(addCable);
		$('#addCable').click(function() {addCable();});
	});
}
/* end cables controller */



/*** EditCrossController ***/
app.controllers.EditCrossCtrl = function() {
	web2spa.load_and_render(null, function() {
		var form = new Form();
	});
}
/* end EditCrossController */

/*** VerticalController ***/
app.controllers.VerticalCtrl = function() {	// requests: #/vertical/id, #/vertical?search=search
	web2spa.load_and_render(
		function() {
			var search = $request.vars.search || '', vId, header;
			$("#master-search").val(search.unescapeHTML());
			if ($request.args[0]) { // for certain vertical view
				vId = $request.args[0];
				header = `${app.A}editvertical/${vId}" title="${L._EDIT_VERT_} ${$scope.vertical}">${$scope.header}</a>`;
			} else {    // for search results view
				vId = false;
				var h2 = `found?search=${search}">`;
				header = `${$scope.header}: ${app.A}view${h2}${L._VIEW_}</a> / ${app.A}edit${h2}${L._EDITOR_}</a>`;
			}
			return app.D_Vertical($scope.header, header, search.toLowerCase(), false, vId);
		},
		function() {
			app.strip_table();
			app.toggle_wrap();
			$userId && app.toggle_ctrl();
		}
	);
}
/* end VerticalController */

/*** NewsController ***/
app.controllers.NewsCtrl = function() {
	web2spa.load_and_render(
		function() { return app.D_Vertical(L._NEWS_, $scope.header, false, true, false); },
		app.strip_table
	);
}
/* end NewsController */

/*** ChainController ***/
app.controllers.ChainCtrl = function() {
	web2spa.load_and_render(null, app.toggle_chain);
}
/* end ChainController */

/*** ViewFoundController ***/
app.controllers.ViewFoundCtrl = function() {
	web2spa.load_and_render(null, app.toggle_chain);
}
/* end ViewFoundController */

