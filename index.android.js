/*
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @providesModule UIExplorerApp
 * @flow
 */
'use strict';

var React = require('react-native');

var {
    AppRegistry,
    //AsyncStorage,
    Animated,
    BackAndroid,
    Text,
    TextInput,
    View,
    Navigator,
    StyleSheet,
    ScrollView,
    ToolbarAndroid,
    NativeModules,
    Image,
    ListView,
    Platform,
    ToastAndroid,
    TouchableNativeFeedback,
    TouchableHighlight,
    } = React;

var ToolbarAndroid = require('ToolbarAndroid');
//var TimerMixin = require('react-timer-mixin');
//var tweenState = require('react-tween-state');

var NRBaiduloc = NativeModules.RNBaiduloc;
var RNEasemob = NativeModules.RNEasemob;

var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
var Storage = require('react-native-storage');
var md5 = require('MD5');

//var MainScreen = require('./MainScreen.android');
var DianhuaList = require('./DianhuaList');
var SearchScreen = require('./SearchScreen');
var AddShopScreen = require('./AddShop');

var dismissKeyboard = require('dismissKeyboard');
var DeviceInfo = require('react-native-device-info');//获取deviceinfo

var ConsolePanel = require('react-native-console-panel').Panel;

var TouchableElement = TouchableHighlight;
if (Platform.OS === 'android') {
    TouchableElement = TouchableNativeFeedback;
}


/**************************首页搜索框***************************/
var HomeAutocomplete = require('./HomeSearch.js' ).create({
    placeholder: '在这里找你想要的',
    minLength: 1, // minimum length of text to search
    autoFocus: false,
    fetchDetails: false,//这里是说点击搜索建议后是否执行事件
    onPress(nav,data, details = null) { // details is provided when fetchDetails = true
        console.log(data);
        console.log(details);
        //nav.push()
        nav.push({
            name: 'story',
            story: data.keyword ,
        });
    },
    onSub(nav,data) {
        nav.push({
            name: 'story',
            story: data ,
        });
    },
    getDefaultValue() {
        return ''; // text input default value
    },
    //query: {
    //    // available options: https://developers.google.com/places/web-service/autocomplete
    //    key: API_KEY,
    //    language: 'en', // language of the results
    //    types: '(cities)', // default: 'geocode'
    //},
    styles: {
        description: {
            fontWeight: 'bold',
        }
    }
});
/**************************存储**************************/
//var KEY_BAIDULOC_LAT = '@Latitude:';
//var KEY_BAIDULOC_LON = '@Lontitude:';
//var KEY_BAIDULOC_CITYCODE = '@Citycode:';

var storage = new Storage({
    //maximum capacity, default 1000
    //最大容量，默认值1000条数据循环存储
    size: 1000,
    //expire time, default 1 day(1000 * 3600 * 24 secs)
    //数据过期时间，默认一整天（1000 * 3600 * 24秒）
    defaultExpires: 1000 * 3600 * 24,

    //cache data in the memory. default is true.
    //读写时在内存中缓存数据。默认启用。
    enableCache: true,
    //if data was not found in storage or expired,
    //the corresponding sync method will be invoked and return
    //the latest data.
    //如果storage中没有相应数据，或数据已过期，
    //则会调用相应的sync同步方法，无缝返回最新数据。
    sync : {
        //we'll talk about the details later.
        //同步方法的具体说明会在后文提到
    }
});
global.storage = storage;
/**************************存储end**************************/

/**************************全局变量的声明***************************/
//global.storage = storage;
var debug = "true1";//这里应该自动判断如何获取开发模式
var conspanel  ;
var APP_URL = 'http://shop.dian400.com:8080';
//var APP_URL = 'http://192.168.0.100:8080'
global.APP_URL = APP_URL;
/**************************全局变量的声明end***************************/


// var THUMBS1 = [
//     {"item1": "美甲", "item2": "SPA"},
//     {"item1": "美容", "item2": "按摩"},
//     {"item1": "桑拿", "item2": "洗浴"},
//     {"item1": "桑拿", "item2": "洗浴"}
// ];
// netht.push(THUMBS1);
// var THUMBS2 = [
//     {"item1": "保养", "item2": "微整形"},
//     {"item1": "宠物医院", "item2": "狗粮"},
//     {"item1": "工商注册", "item2": "商标"},
//     {"item1": "桑拿", "item2": "洗浴"}
// ];
// netht.push(THUMBS2);
// var THUMBS3 = [
//     {"item1": "专利", "item2": "版权"},
//     {"item1": "设计", "item2": "汽车美容"},
//     {"item1": "上门服务", "item2": "商标国际"},
//     {"item1": "桑拿", "item2": "洗浴"}
// ];
// netht.push(THUMBS3);
 

//关键字展示的控件
var KeywordsView = React.createClass({
    _press:1,
    getInitialState() {
        //var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            timethumbs:new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            fadeAnim: new Animated.Value(1), // opacity 0
            netht:[
                    [
                        {"item1": "美甲", "item2": "SPA"},
                        {"item1": "美容", "item2": "按摩"},
                        {"item1": "桑拿", "item2": "洗浴"},
                        {"item1": "桑拿", "item2": "洗浴"}
                    ],
                    [
                        {"item1": "保养", "item2": "微整形"},
                        {"item1": "宠物医院", "item2": "狗粮"},
                        {"item1": "工商注册", "item2": "商标"},
                        {"item1": "桑拿", "item2": "洗浴"}
                    ],
                    [
                        {"item1": "专利", "item2": "版权"},
                        {"item1": "设计", "item2": "汽车美容"},
                        {"item1": "上门服务", "item2": "商标国际"},
                        {"item1": "桑拿", "item2": "洗浴"}
                    ] 
                  ],
        }
    },
    getDataSource: function(keywords: Array<any>): ListView.DataSource {
        return this.state.timethumbs.cloneWithRows(keywords);
    },
    //_animateOpacity() {
    //    this.tweenState('opacity', {
    //        easing: tweenState.easingTypes.easeOutQuint,
    //        duration: 1000,
    //        endValue: this.state.opacity === 0.2 ? 1 : 0.2,
    //    });
    //},
    //componentWillReceiveProps:function(nextProps){
    //    console.log("KeywordsView---WillReceiveProps");
    //    console.log(nextProps);
    //    //this.setState({
    //    //    timethumbs:this.getDataSource( nextProps.timethumbs),
    //    //});
    //},
    //shouldComponentUpdate: function ( nextProps,  nextState) {//组件是否更新
    //    //return nextProps.isupdate;
    //    return true;
    //},
    //componentWillUpdate: function ( nextProps,  nextState) {
    //    console.log("KeywordsView---WillUpdate");
    //    console.log(nextProps);
    //    console.log(nextState);
    //    this._animatedtiming();
    //},
    //componentDidUpdate: function ( nextProps,  nextState) {
    //     console.log("KeywordsView---DidUpdate");
    //     console.log(nextProps);
    //     console.log(nextState);
    //     //this.props.updatedkeyword();
    // },
    componentDidMount: function() {
        console.log("Keywordsdidmount");
        this.setState({
            timethumbs:this.getDataSource(this.state.netht[0]),
        });
        this.requestkeyword();
        //Animated.timing(       // Uses easing functions
        //    this.state.fadeAnim, // The value to drive
        //    {
        //        toValue: 1,        // Target
        //        duration: 1000,    // Configuration
        //    },
        //).start(0);             // Don't forget start!

    },
    requestkeyword:function(){
        fetch(APP_URL+ "/getkw")
        .then((response) => response.json())
        .catch((error) => {//服务器失败，就先从本地读取吧
             
            resultsCache.dataForQuery[query] = undefined;

            this.setState({
                dataSource: this.getDataSource([]),
                isLoading: false,
            });
        })
        .then((responseData) => {
            //if responseData.total > 
            console.log(JSON.stringify(responseData));
            console.log(responseData.result);
            if (typeof responseData.result !== 'undefined'&& responseData.status == "ok") {
                console.log("status  ok"); 
                if (this.isMounted()) {//如果该界面已经被挂载
                     var items = [];
                      responseData.result.map(function (item) {
                             items.push(item);
                      });
                      
                    this.setState({
                        netht: items, 
                    });
                } 

            }else {//没有找到数据
                 
            } 
            
        })
        .done();
    },
    updatekeyword:function(){//更新关键词
        //ToastAndroid.show("更新关键词"+this._press, ToastAndroid.SHORT);
        var datasource ;
        var press = this._press;
        
        if(this._press >= this.state.netht.length ){
            this._press = 0;
            press = 0;
        }
        console.log(this._press);
        datasource = this.getDataSource(this.state.netht[this._press]);

        this._press = press + 1;
        console.log(this._press);

        this.setState({//也许接入网络就好多了，就不会感觉到跳动了
            fadeAnim:new Animated.Value(0),
            timethumbs: datasource,
        });
        //动画
        Animated.timing(       // Uses easing functions
            this.state.fadeAnim, // The value to drive
            {
                toValue: 1,        // Target
                duration: 1000,    // Configuration
            }
        ).start();             // Don't forget start!
    },
    _onPressButtonshow:function(keyword){//这个是外部调用方法--暂时不用
        this.setState({
            timethumbs: this.getDataSource(THUMBS3),
        });
        ToastAndroid.show("点击关键词"+keyword, ToastAndroid.SHORT);
    },
    _onPressButton:function(keyword){
        //ToastAndroid.show("点击关键词"+keyword, ToastAndroid.SHORT);
        console.log("点击关键词");
        dismissKeyboard();
        //this.props.navigator.push
        //this.props.navigator.push({
        //    name: 'movie',
        //    movie: keyword,
        //});
        console.log("push--beg");
        this.props.navigator.push({
            name: 'story',
            story: keyword ,
        });
        console.log("push--end");
    },
    //renderSeparator: function(//listview的driver分割线
    //    sectionID: number | string,
    //    rowID: number | string,
    //    adjacentRowHighlighted: boolean
    //) {
    //    var style = styles.rowSeparator;
    //    if (adjacentRowHighlighted) {
    //        style = [style, styles.rowSeparatorHide];
    //    }
    //    return (
    //        <View key={'SEP_' + sectionID + '_' + rowID}  style={style}/>
    //    );
    //},
    randerow:function(
        rowData: Object,
        sectionID: number | string,
        rowID: number | string,
        highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
    ) {
       var contents;
       var style1 = styles.list_item;
       var style2 = styles.list_item;
       var styletext1 = styles.list_item_text;
       var styletext2 = styles.list_item_text;

        if (rowID==0){
            style1 = [style1, {borderColor:'#e0bfe7', borderWidth:0.5}];
            style2 = [style2, {borderColor:'#b2b5f1', borderWidth:0.5}];
            styletext1 = [styletext1, {color:'#C990D5'}];
            styletext2 = [styletext2, {color:'#868BE9'}];
        }else if(rowID==1){
            //contents = <View style={{height:0.5,backgroundColor:'#d0d0d0'}}></View>
            style1 = [style1, {borderColor:'#ffa490', borderWidth:0.5}];
            style2 = [style2, {borderColor:'#a8d79e', borderWidth:0.5}];
            styletext1 = [styletext1, {color:'#FF7657'}];
            styletext2 = [styletext2, {color:'#86C77A'}];
        }else if(rowID==2){
            //contents = <View style={{height:0.5,backgroundColor:'#d0d0d0'}}></View>
            style1 = [style1, {borderColor:'#f4d988', borderWidth:0.5}];
            style2 = [style2, {borderColor:'#f0c383', borderWidth:0.5}];
            styletext1 = [styletext1, {color:'#EDC33B'}];
            styletext2 = [styletext2, {color:'#E8A145'}];
        }else{
            style1 = [style1, {borderColor:'#abcae6', borderWidth:0.5}];
            style2 = [style2, {borderColor:'#badea4', borderWidth:0.5}];
            styletext1 = [styletext1, {color:'#89B8DC'}];
            styletext2 = [styletext2, {color:'#AAD58B'}];

        }

        return (
            <View style={styles.listitemcontent}>
                <View style={styles.listitem}>
                    <TouchableElement style={{flex: 1}} onPress={() => this._onPressButton(rowData.item1)}>
                        <View  style={style1}>
                            <Animated.Text style={[styletext1,{opacity: this.state.fadeAnim}]}>{rowData.item1}</Animated.Text>
                        </View>
                    </TouchableElement>
                    <View style={{height:39,width:5,marginTop:5,backgroundColor:'#fff'}}></View>
                    <TouchableElement style={{flex: 1}} onPress={() => this._onPressButton(rowData.item2)}>
                        <View style={style2}>
                            <Animated.Text style={[styletext2,{opacity: this.state.fadeAnim}]}>{rowData.item2}</Animated.Text>
                        </View>
                    </TouchableElement>
                </View>
            </View>
        );
    },
    render: function() {
        var navigator = this.props.navigator;
        /*<Animated.Text style={{color:'#000',flex: 1,
         transform: [  // `transform` is an ordered array
         {scaleX: 4},  // Map `bounceValue` to `scale`
         ] }} > ⇋  </Animated.Text>*/
        return (
            <View>
                <View style={{ flex: 1,flexDirection: 'row',}}>
                 <View style={{ flex: 1}}></View>
                <TouchableElement  underlayColor="#d0d0d0" onPress={this.updatekeyword}>
                       <View style={styles.searchText}  >
                           <Image style={{ width: 20,height: 20,}} source={require('./img/iconfont-301.png')} />
                       </View>
                </TouchableElement>
                </View>
                <ListView
                    dataSource={this.state.timethumbs}
                    renderRow={this.randerow}
                    //renderSeparator={this.renderSeparator}
                    />
            </View>
        );
        //return <View>{this.state.timethumbs.map(function(uri, index, array) {
        //    return <Thumb key={index}  item1={uri.item1} item2={uri.item2} navigator={navigator} />
        //})}</View>;
    },
});


var _navigator;
BackAndroid.addEventListener('hardwareBackPress', function() {
    console.log("BackAndroid");
    if (_navigator && _navigator.getCurrentRoutes().length > 1) {
        console.log(_navigator.getCurrentRoutes());
        console.log(_navigator.getCurrentRoutes().length);
        _navigator.pop();
        console.log(_navigator.getCurrentRoutes().length);
        return true;
    }
    console.log("false");
    console.log(_navigator);
    return false;
});

var dianhua = React.createClass({
    // watchID: (null: ?number),
    getInitialState: function() {
        return {
            splashed: false,
            errortext:'',
            isbegin:'true',
            //timethumbs:THUMBS,
            isupdate:true,//关键词界面是否更新
            // initialPosition: 'unknown',
            // lastPosition: 'unknown',
        };
    },
    componentDidMount: function() {
        console.log("dianhua-didmount");

        NRBaiduloc.Initloc();
        this._intim().done(); 

        RCTDeviceEventEmitter.addListener('RNBaiduEvent', ev => {
            //ToastAndroid.show(ev.locationdescribe, ToastAndroid.SHORT);//语义化地理位置
            //ToastAndroid.show(ev.error, ToastAndroid.SHORT);
            //ToastAndroid.show(ev.city, ToastAndroid.SHORT);
            //ToastAndroid.show(ev.citycode, ToastAndroid.SHORT);
            //ToastAndroid.show(ev.latitude, ToastAndroid.SHORT);
            //ToastAndroid.show(ev.lontitude, ToastAndroid.SHORT);
            console.log(ev.locationdescribe);
            console.log(ev.error);
            console.log(ev.city);
            console.log(ev.citycode);
            console.log(ev.latitude);
            console.log(ev.lontitude);

            storage.save({
                key: 'NRBaiduloc',
                rawData: {
                    latitude: ev.latitude,
                    lontitude:ev.lontitude,
                    citycode: ev.citycode,
                    locationdescribe:ev.locationdescribe,
                    addr:ev.addr
                },
                //if not specified, the defaultExpires will be applied instead.
                //if set to null, then it will never expires.
                //如果不指定过期时间，则会使用defaultExpires参数
                //如果设为null，则永不过期
                expires: null
            });
        });
    },
    async  _intim(){//异部执行创建用户或者登录环信服务器
        RNEasemob.Initim();//初始化
        var username = DeviceInfo.getUniqueID();
        var pwd = md5(username+"pwd")
        var imislogin = "";
        var imiscreate = "";
        storage.load({
            key: 'RNEasemob',
            //autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的同步方法
            autoSync: true,
            //syncInBackground(默认为true)意味着如果数据过期，
            //在调用同步方法的同时先返回已经过期的数据。
            //设置为false的话，则始终强制返回同步方法提供的最新数据(当然会需要更多等待时间)。
            syncInBackground: false
        }).then( ret => {                   //found data goes to then()
            //this.setState({region: ret.citycode});
            imislogin = ret.imislogin;
            imiscreate = ret.imiscreate;
            console.log("imislogin--start");
            console.log(imislogin);
            console.log(imiscreate);
            console.log("imislogin--end");
            if(imislogin=="true"){

            }else{
                if(imiscreate=="true"){
                    RNEasemob.Login(username,pwd);
                    RCTDeviceEventEmitter.addListener('RNEasemobEvent', ev => { ////////================这里需要更改监听的key
                        //ToastAndroid.show(ev.lontitude, ToastAndroid.SHORT);
                        console.log(ev.login_err);
                      
                        if(ev.login_err == "success"){
                            storage.save({
                                key: 'RNEasemob',
                                rawData: {
                                    imislogin: "true",
                                    imiscreate: "true" 
                                },
                                //if not specified, the defaultExpires will be applied instead.
                                //if set to null, then it will never expires.
                                //如果不指定过期时间，则会使用defaultExpires参数
                                //如果设为null，则永不过期
                                expires: null
                            });
                        }else{ 
                            ToastAndroid.show("错误"+ev.login_err, ToastAndroid.SHORT);
                        }   
                    });   
                }else{
                    this.createandlogin(username,pwd);
                    // RNEasemob.Create(username,pwd);//这里缺少一步登录 
                    // RCTDeviceEventEmitter.addListener('RNEasemobEvent', ev => { 
                    //     //ToastAndroid.show(ev.lontitude, ToastAndroid.SHORT);
                    //     console.log(ev.create_err); 
                    //     if(ev.create_err == "nil"){
                    //         storage.save({
                    //             key: 'RNEasemob',
                    //             rawData: {
                    //                 imiscreate: "true" 
                    //             },
                    //             //if not specified, the defaultExpires will be applied instead.
                    //             //if set to null, then it will never expires.
                    //             //如果不指定过期时间，则会使用defaultExpires参数
                    //             //如果设为null，则永不过期
                    //             expires: null
                    //         });
                    //     }else if(ev.create_err == "NONETWORK_ERROR"){ 
                    //         ToastAndroid.show("网络异常，请检查网络！", ToastAndroid.SHORT);
                    //     }else if(ev.create_err == "USER_ALREADY_EXISTS"){ 
                    //         //ToastAndroid.show("用户已存在！", ToastAndroid.SHORT);
                    //         RNEasemob.Login(username,pwd);
                    //         RCTDeviceEventEmitter.addListener('RNEasemobEvent', ev => { ////////================这里需要更改监听的key
                    //             //ToastAndroid.show(ev.lontitude, ToastAndroid.SHORT);
                    //             console.log(ev.login_err);
                              
                    //             if(ev.login_err == "success"){
                    //                 storage.save({
                    //                     key: 'RNEasemob',
                    //                     rawData: {
                    //                         imislogin: "true",
                    //                         imiscreate: "true" 
                    //                     },
                    //                     //if not specified, the defaultExpires will be applied instead.
                    //                     //if set to null, then it will never expires.
                    //                     //如果不指定过期时间，则会使用defaultExpires参数
                    //                     //如果设为null，则永不过期
                    //                     expires: null
                    //                 });
                    //             }else{ 
                    //                 ToastAndroid.show(ev.login_err, ToastAndroid.SHORT);
                    //             }   
                    //         });
                    //     }else if(ev.create_err == "UNAUTHORIZED"){ 
                    //         ToastAndroid.show("注册失败，无权限！", ToastAndroid.SHORT);
                    //     }else{ 
                    //         ToastAndroid.show(ev.create_err, ToastAndroid.SHORT);
                    //     }  
                    // });  
                }
            }
        }).catch( err => {                  //any exception including data not found
            this.createandlogin(username,pwd);
            console.warn("_intim-storage-load-err "); 
            console.warn(err);              //goes to catch()
                                            //如果没有找到数据且没有同步方法，
                                            //或者有其他异常，则在catch中返回  
        });
        

    },
    createandlogin:function(username,pwd){
        RNEasemob.Create(username,pwd);//如果没有找到数据
            RCTDeviceEventEmitter.addListener('RNEasemobEvent', ev => { 
                //ToastAndroid.show(ev.lontitude, ToastAndroid.SHORT);
                console.log(ev.create_err); 
                if(ev.create_err == "nil"){
                    storage.save({
                        key: 'RNEasemob',
                        rawData: {
                            imiscreate: "true" 
                        },
                        //if not specified, the defaultExpires will be applied instead.
                        //if set to null, then it will never expires.
                        //如果不指定过期时间，则会使用defaultExpires参数
                        //如果设为null，则永不过期
                        expires: null
                    });
                }else if(ev.create_err == "NONETWORK_ERROR"){ 
                    ToastAndroid.show("网络异常，请检查网络！", ToastAndroid.SHORT);
                }else if(ev.create_err == "USER_ALREADY_EXISTS"){ 
                    //ToastAndroid.show("用户已存在！", ToastAndroid.SHORT);
                    RNEasemob.Login(username,pwd);
                    RCTDeviceEventEmitter.addListener('RNEasemobEvent', ev => { ////////================这里需要更改监听的key
                        //ToastAndroid.show(ev.lontitude, ToastAndroid.SHORT);
                        console.log(ev.login_err);
                      
                        if(ev.login_err == "success" || ev.login_err == ""){
                            storage.save({
                                key: 'RNEasemob',
                                rawData: {
                                    imislogin: "true",
                                    imiscreate: "true" 
                                },
                                //if not specified, the defaultExpires will be applied instead.
                                //if set to null, then it will never expires.
                                //如果不指定过期时间，则会使用defaultExpires参数
                                //如果设为null，则永不过期
                                expires: null
                            });
                        }else{ 
                            ToastAndroid.show("登录失败"+ev.login_err, ToastAndroid.SHORT);
                        }   
                    });
                }else if(ev.create_err == "UNAUTHORIZED"){ 
                    ToastAndroid.show("注册失败，无权限！", ToastAndroid.SHORT);
                }else{ 
                    //ToastAndroid.show(ev.create_err, ToastAndroid.SHORT);//这里面会出错，其一次安装会走这一步
                }  
            }); 
    }, 
    // componentWillUnmount: function() {
    //    
    // },
    addshop:function(){
        _navigator.push({
            name: 'addshop',
        });
    },
    updatedkeyword:function(){//更新完成关键词
        console.log("updatedkeyword");
        this.setState({
            isbegin:"true",
            isupdate:false,//不更新关键词界面
        });
    },
    _appendMessage:function(message){
        this.setState({errortext: message});
    },
    RouteMapper: function(route, navigationOperations) {//这里应该没有第三个参数
        _navigator = navigationOperations;
//<Text style={{color:'#d0d0d0'}}>搜索</Text>4876FF
/*
<View style={styles.searchpress}>
 <TouchableElement  underlayColor="#d0d0d0" onPress={this.search}>
 <View style={styles.searchpressText}  >
 <TextInput
 ref='textInput'　
 style={styles.textInput}　　
 placeholder="搜索"
 clearButtonMode="while-editing"
 />
 </View>
 </TouchableElement>
 </View>
 //搜索框
<View style={styles.searchpress}>
 <TextInput
 ref='textInput'　
 style={styles.textInput}　　
 placeholder="搜索"
 clearButtonMode="while-editing"
 />
 </View> 
 */
        if(debug=="true"){
            conspanel =  <ConsolePanel limit={10} style={{left:20,top:20}}/>
        } 
        switch (route.name) {
            case "home":
                // <Image style={{ width: 160,height: 56,}} source={{uri: 'http://192.168.0.100/siipa/googlelogo.png'}} />
                return (
                    <View style={styles.container}>
                        <View style={styles.searchbar}> 
                            <View style={{flex:1}}></View>
                            <TouchableHighlight  underlayColor="#d0d0d0" onPress={this.addshop}>
                                <View style={styles.AddText}  ><Text style={{color:"#5E5E5E",fontSize:50,fontWeight:'300'}}> ＋</Text></View>
                            </TouchableHighlight>
                        </View>
                        <View style={{backgroundColor:'#fff',paddingBottom:10}}>
                            <View style={styles.title}>
                                <Image style={{ width: 160,height: 56,}} source={require('./img/googlelogo.png')} />
                            </View>
                            <HomeAutocomplete nav={navigationOperations} />
                        </View>
                        <ScrollView contentContainerStyle={styles.contentContainer}>
                            <Text>{this.state.errortext}</Text>
                            <View style={styles.scrollist}>
                               <KeywordsView navigator={navigationOperations} />
                            </View>
                        </ScrollView>
                        {conspanel}
                    </View>
                );
            case "story":
                //var kv =  new(KeywordsViewnew);
                //kv._onPressButtonshow("text");
                //kv.updatekeyword();
                return (
                    <View style={styles.container}>
                        <DianhuaList
                            style={{flex: 1}}
                            navigator={navigationOperations}
                            story={route.story} />
                        {conspanel}
                    </View>
                );
            case "search":
                return (
                    <View style={styles.container}>
                        <SearchScreen
                            style={{flex: 1}}
                            navigator={navigationOperations}
                            story={route.story} />
                        {conspanel}
                    </View>
                );
            case "addshop":
                return(
                    <View style={styles.container}>
                        <AddShopScreen
                            style={{flex: 1}}
                            navigator={navigationOperations}
                            story={route.story} />
                        {conspanel}
                    </View>

                );
        }
    },
    search:function(){
        _navigator.push({
            name: 'search',
        });
    },
    render: function() {
        var initialRoute = {name: 'home'};
        return (
            <Navigator
                style={styles.container}
                initialRoute={initialRoute}
                configureScene={(route) => Navigator.SceneConfigs.FadeAndroid }
                //configureScene={(route) => Navigator.SceneConfigs.FloatFromRight}
                renderScene={this.RouteMapper}
                />
        );
    }
});
//<KeywordsView timethumbs={this.state.timethumbs} isupdate={this.state.isupdate} navigator={navigationOperations} updatedkeyword={this.updatedkeyword}/>

 

//var THUMBS = ['https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-ash3/t39.1997/p128x128/851549_767334479959628_274486868_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-prn1/t39.1997/p128x128/851561_767334496626293_1958532586_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-ash3/t39.1997/p128x128/851579_767334503292959_179092627_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-prn1/t39.1997/p128x128/851589_767334513292958_1747022277_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-prn1/t39.1997/p128x128/851563_767334559959620_1193692107_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-prn1/t39.1997/p128x128/851593_767334566626286_1953955109_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-prn1/t39.1997/p128x128/851591_767334523292957_797560749_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-prn1/t39.1997/p128x128/851567_767334529959623_843148472_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-prn1/t39.1997/p128x128/851548_767334489959627_794462220_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-prn1/t39.1997/p128x128/851575_767334539959622_441598241_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-ash3/t39.1997/p128x128/851573_767334549959621_534583464_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-prn1/t39.1997/p128x128/851583_767334573292952_1519550680_n.png'];
// THUMBS = THUMBS.concat(THUMBS); // double length of THUMBS
//var createThumbRow = (uri, i) => <Thumb key={i}  item1={uri.item1} item2={uri.item2} />;

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
    },
    contentContainer:{
        paddingVertical: 2
    },
    text: {
        fontSize: 20,
        color: '#888888',
        left: 80,
        top: 20,
        height: 40,
    },
    img: {
        width: 64,
        height: 64,
    },
    AddText:{
        height: 56,
        justifyContent: 'center',
    },
    title:{
        marginTop:0,
        //backgroundColor: '#00a2ed',
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    titleText: {
        //flex: 1,
        fontSize: 50,
        color: '#00a2ed',
        //color: '#fff',
        fontWeight: 'bold',
    },
    searchText:{
        height: 56,
        width:80,
        marginRight:10,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        color:'#fff',
    },
    searchbar:{
        height: 56,
        //paddingVertical: 20,
        flexDirection: 'row',
    },
    searchbox:{
        height: 56,
        flex: 1,
    },
    searchbtn:{
        height: 36,
        width:80,
        marginBottom: 20,
        marginRight:10,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00a2ed',
        borderRadius: 3,
    },
    searchpress:{
        marginLeft:15,
        marginRight:15,
        marginTop:10,
        //backgroundColor: '#D9D9D9',
        height:46,
        flexDirection: 'column',
        borderColor:'#C2C2C2',
        borderWidth:0.5,
    },
    textInput: {
        flex: 1,
        backgroundColor: '#FFFFFF',
       // height: 28,
        borderRadius: 5,
        paddingTop: 4.5,
        paddingBottom: 4.5,
        paddingLeft: 10,
        paddingRight: 10,　
        marginLeft: 8,
        marginRight: 8,
        fontSize: 15,
    },
    searchpressText:{
        flex: 1,
        height: 36,
        margin:1,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 3,
        color:'#fff',
        flexDirection: 'column',
    },
    scrollist:{
        marginTop:2,
    },
    listitemcontent:{
        marginLeft :15,
        marginRight :15,
        height: 60,
        backgroundColor: '#fff',
        flexDirection: 'column',
    },
    listitem:{
        height: 55,
        marginTop:5,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    list_item:{
        flex: 1,
        height: 45,
        justifyContent: 'center',
        backgroundColor: '#fff',
        //opacity:0.8,
    },
    list_item_text:{
        fontSize: 15,
        textAlign: 'center',
        //color:'#000',
        //color:'#fff',
    },
    rowSeparator: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        height:1,
        marginLeft: 4,
    },
    rowSeparatorHide: {
        opacity: 0.0,
    },
});

AppRegistry.registerComponent('dianhua', () => dianhua);

/**********提示text的独立控件****** /
 var Tipstext = React.createClass({
    mixins: [TimerMixin],
    _handle: (null : any),
    getInitialState() {
        return {
            timenum:10,
            iself:"false",
        }
    },
    componentWillReceiveProps:function(nextProps){
        console.log("Tipstext---WillReceiveProps");
        console.log(nextProps);
        if(nextProps.isbegin ==="true"){
            this._handle = this.setInterval(
                () => {
                    var timenum =  this.state.timenum - 1 ;
                    this.setState({
                        timenum: timenum,
                        iself:"true",
                    });
                }, 1000
            );
        }else{
            this.clearInterval(this._handle);
        }
    },
    componentWillUpdate: function ( nextProps,  nextState) {
        console.log("tipstext--componentWillUpdate");
        console.log(nextProps);
        console.log(nextState);
        if(10 < 0){
            console.log("10 < 0");
        }
        if(nextState.timenum < 0){
            console.log("<0");
            console.log(nextState);
            console.log("<0");
        }
        if(nextState.timenum === -1){
            this.setState({
                timenum: 10,
            });
           // this.clearInterval();
            //this.clearInterval(this._handle);
            this.props.updatefunc();
        }
    },
    componentDidMount: function() {
        console.log("Tipstextdidmount");
        this._handle = this.setInterval(
            () => {
                var timenum =  this.state.timenum - 1 ;
                this.setState({
                    timenum: timenum,
                    iself:"true",
                });
            }, 1000
        );
    },
    render: function() {
        var coment = this.state.timenum === 0 ?
            <Text >正在更新关键字......</Text>
            :
            <Text>距离更新关键字还有{this.state.timenum}秒</Text>;
        return    coment ;
    }
});
 //<Tipstext updatefunc={this.updatekeyword} isbegin="false"/>
 //<Tipstext updatefunc={this.updatekeyword} isbegin={this.state.isbegin}/> 暂时不用倒计时
 / *****************************************/

//new关键字展示的控件
/********************************暂时用不了。。。 /
 class KeywordsViewnew extends React.Component{
    constructor(props){
        super(props);
        this._press = 1;
        this.state = {
            timethumbs:new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        };
    }
    getDataSource(keywords: Array<any>): ListView.DataSource {
        return this.state.timethumbs.cloneWithRows(keywords);
    }
    componentDidMount() {
        console.log("Tipstextdidmount");
        this.setState({
            timethumbs:this.getDataSource(THUMBS1),
        });

    }
    updatekeyword(){//更新关键词
        ToastAndroid.show("更新关键词"+this._press, ToastAndroid.SHORT);
        //var datasource ;
        //if (this._press==1) {
        //    datasource = this.getDataSource(THUMBS2);
        //    this._press = 2;
        //}else if(this._press==2) {
        //    datasource = this.getDataSource(THUMBS3);
        //    this._press = 3;
        //}else{
        //    datasource = this.getDataSource(THUMBS1);
        //    this._press = 1;
        //}
        //this.setState({
        //    timethumbs: datasource,
        //});
    }
    _onPressButtonshow(keyword){
        this.setState({
            timethumbs: this.getDataSource(THUMBS3),
        });
        ToastAndroid.show("点击关键词"+keyword, ToastAndroid.SHORT);
    }
    _onPressButton(keyword){
        //ToastAndroid.show("点击关键词"+keyword, ToastAndroid.SHORT);
        console.log("点击关键词");
        dismissKeyboard();
        console.log("push--beg");
        this.props.navigator.push({
            name: 'story',
            story: keyword ,
        });
        console.log("push--end");
    }
    randerow(rowData){
        var item1 = rowData.item1;
        var item2 = rowData.item2;
        return (
            <View style={styles.listitem}>
                <TouchableElement style={{flex: 1}} onPress={item1 => this._onPressButton(item1)}>
                    <View  style={styles.list_item}>
                        <Text style={styles.list_item_text}>{rowData.item1}</Text>
                    </View>
                </TouchableElement>
                <View style={{height:39,width:0.5,marginTop:5,backgroundColor:'#d0d0d0'}}></View>
                <TouchableElement style={{flex: 1}} onPress={item2 => this._onPressButton(item2)}>
                    <View style={styles.list_item}>
                        <Text style={styles.list_item_text}>{rowData.item2}</Text>
                    </View>
                </TouchableElement>
            </View>
        );
    }
    render() {
        var navigator = this.props.navigator;
        return (
            <View>
                <TouchableElement  underlayColor="#d0d0d0" onPress={()=>this.updatekeyword}>
                    <View style={styles.searchText}  ><Text style={{color:'#000'}}>换一批</Text></View>
                </TouchableElement>
                <ListView
                    dataSource={this.state.timethumbs}
                    renderRow={this.randerow}
                    />
            </View>
        );
    }
}
 ************************/
/*搜索框view
 * <View style={styles.searchbar}>
 <TextInput
 style={{height: 40, borderColor: 'gray', borderWidth: 1,flex: 1}}
 onChangeText={(text) => this.setState({text})}
 value={this.state.text}
 onFocus={this.search}
 placeholder="请输入搜索内容"
 />
 <View style={styles.searchbtn}><Text >搜索</Text></View>
 </View>
 */
/********
 * getInitialState() {
 return { opacity: 0.2 }
 },
 _animateOpacity() {
 this.tweenState('opacity', {
 easing: tweenState.easingTypes.easeOutQuint,
 duration: 1000,
 endValue: this.state.opacity === 0.2 ? 1 : 0.2,
 });
 },
 componentWillUpdate: function ( nextProps,  nextState) {
 console.log(nextProps);
 console.log(nextState);
 console.log("WillUpdate");
 //this._animateOpacity();
 },* /
 var Thumb = React.createClass({
    shouldComponentUpdate: function(nextProps, nextState) {//是否允许界面更新
        return true;
    },
    componentDidMount: function() {
        console.log("didmount");
        //this._animateOpacity();
    },
    componentWillUnmount:function(){
        console.log("Unmount");
    },
    _onPressButton1:function(){
        console.log("onpress");
        this.props.navigator.push({
            name: 'story',
            story:  this.props.item1 ,
        });
    },
    _onPressButton2:function(){
        console.log("onpress");
        this.props.navigator.push({
            name: 'story',
            story:  this.props.item2 ,
        });
    },
    render: function() {
        return (
            <View style={styles.listitemcontent}>
                <View style={{height:0.5,backgroundColor:'#d0d0d0'}}></View>
                <View style={styles.listitem}>
                    <TouchableElement style={{flex: 1}} onPress={this._onPressButton1}>
                        <View  style={styles.list_item}>
                            <Text style={styles.list_item_text}>{this.props.item1}</Text>
                        </View>
                    </TouchableElement>
                    <View style={{height:39,width:0.5,marginTop:5,backgroundColor:'#d0d0d0'}}></View>
                    <TouchableElement style={{flex: 1}} onPress={this._onPressButton2}>
                        <View style={styles.list_item}>
                            <Text style={styles.list_item_text}>{this.props.item2}</Text>
                        </View>
                    </TouchableElement>
                </View>
            </View>
        );
    }
});
*/