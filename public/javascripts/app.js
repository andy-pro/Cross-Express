/*
 * client side
 * Cross Connecting People
 * UkSATSE
 * Telecommunication Service
 * web2spa - together we go to the single page app!
 * andy-pro 2016
 */

/*** Global constants  ***/
const _DEBUG_ = false;
//const _DEBUG_ = true;
const _mypre = '<pre class="mypre">%s</pre>';

//blade.Runtime.options.mount = '/static/views/';

var _ = web2spa;

var app = {

	name: 'cross',
	api: 'api',
	controllers: {},

	LINK_CLRS:  ['#fff', '#9ff', '#f9f', '#ff9', '#aaf', '#afa', '#faa', '#bdf', '#fbd', '#dfb', '#fdb'],
	CABLE_CLRS: ['#fff', '#bff', '#fbf', '#ffb', '#ccf', '#bfc', '#fcc', '#cdf', '#fce', '#efe', '#fdc'],
	/* for DEBUG */
	vars_watch: function() {
		$("#varswatch").text('Size of jQuery cache:%s, Size of window:%s'.format(Object.keys($.cache).length, Object.keys(window).length));
		//console.dir($.cache);
	},

	/* === stage hyperlink helpers === */
	A_Cross: function(_o) {
		//return `${app.A}editcross/${_o.crossId.toString()}" title="${L._EDIT_CROSS_} ${_o.cross}">${_o.cross}</a>`;
		return `<a href="/crosses/${_o.crossId}" title="${L._EDIT_CROSS_} ${_o.cross}">${_o.cross}</a>`;
	},
	A_Vertical: function(_o, x) {
		return `<a class="web2spa ${x||''}" href="${web2spa.start_path}vertical/${_o.verticalId}" title="${L._VIEW_VERT_} ${_o.vertical}">${_o.header||_o.vertical}</a>`;
	},
	A_Plint: function(_o) {
		var start1 = _o.pairId + _o.start1-1;
		return `<sup>${_o.start1}</sup>${app.A}editplint/${_o.plintId}" title="${L._EDIT_PLINT_} ${_o.plint}">${_o.plint}</a>`;
	},
	A_Pair: function(_o, title) {
		//var pair = _o.pairId + _o.start1-1,
		var hint, pair = _o.pairId + _o.start1;
		if (title) hint = `${L._CHAIN_} "${title}"`;
		else {
			title = `${L._PAIR_} ${pair}`;
			hint = `${L._EDIT_PAIR_} ${pair}`;
		}
		return `${app.A}editpair/${_o.plintId}/${_o.pairId}" title='${hint}' data-pair="1">${title}</a>`;
	},
	pairRow: function(pair, depth, colv) {
		depth = typeof depth !== 'undefined' ? depth : 4;
		var tda = [], fna = [this.A_Cross, this.A_Vertical, this.A_Plint, this.A_Pair];
		for(var i=0; i<depth; i++) tda.push((colv ? `<td class="colv${i}">` : '<td>')+fna[i](pair)+'</td>');
		return tda.join('');
	},
	/* --- stage hyperlink helpers --- */

	/* toggle helpers for pair href */
	toggle_wrap: function() {
		app.wrapMode.init(function(value) { $('table.vertical td').css('white-space', value ? 'pre-line' : 'nowrap'); }, true);
	},
	toggle_chain: function() {  // find <a> elements, store original href to custom data property and set 'onclick' handler
		$scope.a = $('a[data-pair]').each(function() { $(this).data('href', this.attributes.href.value); });
		app.chainMode.init(function(value) { $scope.a.each(function(){ this.href = $(this).data('href')+(value?'?chain=true':''); }); }, true);
	},
	toggle_ctrl: function() {
		function cmp_href()	{   // compose href for <a>: replace 'ctrl' with 'editpair' or 'chain', add/remove var 'chain'
			$.each($scope.a, function() {
				var em = app.editMode.value, cm = app.chainMode.value; // shortcuts
				this[2].href = this[0] + (em?'editpair':'chain') + this[1] + (em&&cm?'?chain=true':'');
			});
		}
		$scope.a = [];  // array for store splitting href: part1, part2, jQuery <a> elements
		$('a[data-pair]').each(function(i) { $scope.a[i] = this.attributes.href.value.split('\/ctrl\/').concat([this]); });
		app.editMode.init(cmp_href);  // set 'change editMode handler'
		app.chainMode.init(cmp_href, true);  // set 'change chainMode handler' and starting once
	},
	/* toggle helpers for pair href */

	str_editMode: function() {
		return `<label><input id="editMode" type="checkbox">${L._EDITOR_}</label>`;
	},
	D_Vertical: function(doctitle, header, search, news, vId) {
		return { // rendering object adaptor for Vertical/News Controllers View
			doctitle: doctitle,
			plints:$scope.plints,
			users:$scope.users,
			cables:$scope.cables,
			header:header,
			search:search,
			news:news,
			vId:vId
		}
	},
	chain_th: function() {
		var out = [];
		tbheaders.concat(L._DETAILS_,L._COMMON_DATA_,L.i_par).forEach(function(h) { out.push(`<th>${h}</th>`); });
		return out.join('');
	},
	chain_body: function(chain) {
		var out = [];
		chain.forEach(function(link) {
			out.push.call(out,
				`<tr style="background:${app.LINK_CLRS[link.clr]}">`,
				app.pairRow(link),
				`<td>${link.det}</td><td>${link.comdata}</td><td>${link.par?L.i_ok:""}</td></tr>`
			);
		});
		return out.join('');
	},
	strip_table: function() {
		$('table tr:nth-child(odd)').css('background-color', function(i, v) {
			// blacking color like rgb(rrr, ggg, bbb)
			return v.replace(/(\d+)/g, function(s, m) { return (+m/1.03).toFixed(); });
		});
	},
	db_clear: function() { if (confirm("A you sure?")) location.href = web2spa.root_path + 'cleardb'; },

	auth_menu: function(user) {
	  $userId = user._id;
  	console.log('auth_state_onchange occure', user);
		var menu = {templateId: 'DropdownMenuTmpl'};
		if ($userId) {
			_.extendObj(menu, {
				targetEl: 'toolsmenu',
				header: L._TOOLS_,
				prefix: '',
				subitems: [
					{ href: 'crosses/new', icon: 'th-list', title: L._NEW_CROSS_ },
					{ href: 'cables', icon: 'random', title: L._CABLES_ }
				]
			});
			_.render(menu);
			// auth menu: login, logout, profile, change_password, register, request_reset_password
			_.extendObj(menu, {
			  header: L._WELC__ + user.first_name,
				subitems: [
				  { href: 'profile', icon: 'user', title: L._PROFILE_ },
				  { href: 'change_password', icon: 'lock', title: L._PASS_ },
					{ divider: 1 },
				  { href: 'logout', icon: 'off', title: L._LOG_OUT_ }
				]
			});
		} else {
		  $('#toolsmenu').empty();
			_.extendObj(menu, {
				header: L._LOG_IN_,
				subitems: [
				  { href: 'register', icon: 'user', title: L._SIGN_UP_ },
				  { href: 'request_reset_password', icon: 'lock', title: L._LOST_PASS_ },
					{ divider: 1 },
				  { href: 'login', icon: 'off', title: L._LOG_IN_ }
				]
			});
		}
		menu.prefix = 'user/';
		menu.targetEl = 'authmenu';
		_.render(menu);
	},

	/*** template bootstrap helpers ***/
	/*
		osize - size of title or offset, default 3
		isize - input element size, default 8
		title
		type - default 'text'
		name - default 'title'
		value - default ''
		require - default 'false'
	*/
	bs_input: function() {
		var res = '';
		for(var i=0; i < arguments.length; i++) {
		  var _o = arguments[i];
		  res += `<div class="form-group"><label class="control-label col-md-${_o.osize||3}">${_o.title}</label><div class="col-md-${_o.isize||8}"><input class="form-control" type="${_o.type||'text'}" name="${_o.name||'title'}" value="${_o.value||''}" ${_o.req?'required':''}></div></div>`;
		}
		return res;
	},

	bs_checkbox: function(_o) {
		return `<div class="form-group"><div class="col-md-offset-${_o.osize||3} col-md-${_o.isize||8}"><div class="checkbox"><label><input class="${_o.class||'boolean'}" type="checkbox" name="${_o.name}" ${_o.checked?'checked':''}>${_o.title}</label></div></div></div>`;
	},

	bs_panel: function(heading, body, size, clr) {
		return `<div class="col-md-${size||6}">
			<div class="panel panel-${clr||'default'}">
				<div class="panel-heading">${heading}</div>
				<div class="panel-body">${body}</div>
			</div>
		</div>`;
	}

	/* end template helpers */

};

$(function () {
	web2spa.init({
		name: app.name,
		root: '',
		mainpage: '',
		api: app.api,
		//json_api: true,
		post_url: '',
		//auth_menu: app.auth_menu,
		controllers: app.controllers,
		lexicon: 'lexicon',
		//templates: 'templates',
		//templates_json: 'templates',
		_TMPLS_: false, // convert templates to JSON format, copy from console
		target: 'crosshome',	// main div for content
		//post_back: true, // enable history.back() when forms are posted
		esc_back: true, // enable history.back() when 'ESC' key pressed
		selector: 'a:not(a[data-bypass])',
		flyover_url: new RegExp('^\/user(?:$|\/\w*)'), // '/user', '/user/', '/user/...' not be pushed to history
		//mega: true, // 'controller/function' model
		set_title: true, // controller sets the document title
		modal: ['#modal-container', '.modal-title', 'modal-body'],

		routes: [
			['Crosses', {index:true}],
			['Crosses'],
			['News', {template:'vertical'}],
			//['Cables', {login_req:true}],
			['Cables'],
			//['Vertical'],
			//['Chain'],
			//['ViewFound'],
			//['EditCross', {login_req:true}],    // will be redirect to login path, if not authorized
			//['EditVertical', {login_req:true}],
			//['EditPlint', {login_req:true}],
			//['EditPair', {login_req:true}],
			//['EditFound', {login_req:true}],
			//['Restore', {master: true, login_req:true}],	// url: 'cross/default/restore', because master=true
			//['User', {master: true, login_path:true}],  // url: 'cross/default/user' and this is login path pluralistically
			['User'],
			['Error', {error_path: true}]
		],

		beforeStart: function() {   /* callback, perform after app load & init, but before start, application setup */
			L = web2spa.lexicon.data;   // global shorthand to lexicon
			tbheaders = [L._CROSS_, L._VERT_, L._PLINT_, L._PAIR_];
			L._BTNBACK_ = `<button type="button" class="close" aria-hidden="true" onclick="history.back();return false;" title="${L._BACK_} (Esc)">&times;</button>`;
			L._BTNOKCNSL_ = web2spa._render({templateId:'btnOkCancelTmpl'});    // helpers, inline templates for common buttons
			var icon = '<i class="glyphicon glyphicon-%s">';
			L.i_ok = icon.format('ok');
			L.i_par = icon.format('random');
			app.A = '<a class="web2spa" href="' + web2spa.start_path; // <a> print helper
			app.chainMode = new CheckBox('chainMode');
			app.editMode = new CheckBox('editMode');
			app.wrapMode = new CheckBox('wrapMode');
			_DEBUG_ && web2spa.targetEl.before('<div id="debug" class="well"><button class="btn btn-default" onclick="vars_watch()">Watch</button><span id="varswatch"></span></div>');
			//app.auth_menu();
			_.load({
			  url: 'user/info',
				data: true,
				onload: app.auth_menu
			});
		},
		beforeNavigate: function() {
			app.chainMode.reset_handler();
		},
		afterNavigate: function() {
			_DEBUG_ && app.vars_watch();
		},
		onLogIn: function(user) {
			app.auth_menu(user);
			_.navigate();
		},
		onLogOut: function(user) {
			app.auth_menu(user);
			_.navigate();
		}

	});
});
