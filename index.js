/*
    检索组件 
    详情见 help 方法
*/

import React, { Component } from "react";
import {
  // SearchBar,
  WingBlank,
  WhiteSpace,
  Menu,
  Flex
  // NavBar
} from "antd-mobile";
import styles from "./style.less";
const FlexItem = Flex.Item;

class WFilter extends Component {
  //静态方法
  static Item = props => {
    let {
      //内容
      children,
      //field
      field,

      //总数据 数组[value, label, children]
      data,

      //onClick存在的话就不会执行内置的click事件 一般用于【全部】按钮 传入后data属性将失去意义  function
      onClick,

      //切换函数
      // _getData,

      //传入的切换函数
      // onChange,

      //默认数据  数组['3', '4']
      defaultValue,

      //其他比如样式什么的
      other,

      //上一级传入的设置筛选条件的方法
      setData,

      //关闭弹窗的函数
      onCancel

      //设置默认值
      // setDefaultValue
    } = props;
    if (children) {
      //设置默认值
      let dafValue = defaultValue; //防止和别的冲突
      return (
        <FlexItem className={styles.myFlexItem}>
          <div
            className={`${styles.fitem} fitem`} //设置类名是为了让点击的时候做个样式
            onClick={() => {
              onClick
                ? (() => {
                    onCancel();
                    onClick({ field });
                  })()
                : setData({ data, dafValue, field });
            }}
            ref={ele => {
              if (ele) {
                //提示必须设置field属性
                if (!field) {
                  console.error("请为【" + children + "】选项元素设置一个唯一的field属性。");
                }

                //选项菜单导航条设置点击的时候字体变色
                ele.onclick = function() {
                  let allEle = document.querySelectorAll(".fitem");
                  for (let i = 0; i < allEle.length; i++) {
                    allEle[i].style.color = "";
                  }
                  ele.style.color = "#108ee9";
                };
              }
            }}
            {...other}
          >
            {children}
          </div>
        </FlexItem>
      );
    } else {
      return "";
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      //总数据
      initData: [], //[{label, value, childred:[]}]
      //选好的数据 这个返回的是所有选择项选择的值
      selectedData: {},
      //默认数据
      defaultValue: {}, // 格式['1', ['3', '4']]  || ['1', '1-1']
      //弹层是否是出现状态
      show: false,
      //目前操作的是哪个选项
      nowField: ""
    };
    // console.log(this);
    //关闭菜单
    this.closeMenuAndOk = this.closeMenuAndOk.bind(this);
    this.onCancel = this.onCancel.bind(this);
    //确定
    this.onOk = this.onOk.bind(this);

    //切换选项
    this.onChange = this.onChange.bind(this);

    //获取选择好的数据
    this.getData = this.getData.bind(this);

    //设置状态里的默认值
    this.setDefaultValue = this.setDefaultValue.bind(this);

    //设置数据
    this.setData = this.setData.bind(this);

    //清空选择的数据一般重置用到
    this.reSetSelectedData = this.reSetSelectedData.bind(this);
  }

  componentDidMount() {
    this.help();
  }

  help() {
    if (this.props.help) {
      console.log(
        `
            %c
            筛选条件插件帮助：

            调用方法：
            <WFilter help ref={(el)=>{this.WFilter = el}}>  
                <WFilter.Item field="all" onClick={()=>{console.log('全部')}}>全部</WFilter.Item> 
                <WFilter.Item field="test" data={sData}>测试</WFilter.Item>
            </WFilter>

            WFilter
                属性
                    help 帮助   [Boole]
                    other  可以传入样式什么的 [any] 
                    Menu={{multiSelect:true}}  同步antd-moble的菜单设置
                    onChange=({ selectedData, nowField })=>{} 切换时会自动执行   [fn]
                    onOk={(val)=>{}}  关闭/确认时会执行的函数  [fn]

            WFilter.Item：
                  属性
                    field="documentNo"  唯一的名字必传  [string] 
                    onClick 传入后data属性将失去意义  [fn]
                    data     所有的选择项   [Array] -> ([{label, value, children:[{...}]}])
                    defaultValue 默认数据  [Array] -> (单选['3', '4']， 多选['3', ['0', '5']])
                    other  可以传入样式什么的 [any]  
            方法：
                1、getData((val)=>{})   eg: this.WFilter.getData(); 
                2、reSetSelectedData(callback)  清空选择的数据一般重置用到 重置后执行的方法都应放到callback函数

            `,
        "color:green;border:1px solid green;border-radius:3px;padding:10px;box-sizing:border-box"
      );
    }
  }

  getData() {
    return this.state.selectedData;
  }
  //清空选择的数据一般重置用到
  reSetSelectedData(cb) {
    this.setState(
      {
        selectedData: {},
        defaultValue: {}
      },
      cb
    );
  }

  //设置完成后将返回一个回调
  setData({ data = [{ value: "", label: "暂无数据" }], dafValue = {}, field }) {
    let { nowField, show } = this.state;
    this.setDefaultValue({ dafValue, field });
    this.setState({
      show: nowField === field ? !show : true, //如果点击的是当前菜单的话做相反的动作
      initData: data,
      nowField: field //设置当前字段field
    });
  }

  //设置状态里的默认值 初始化时使用
  setDefaultValue({ value, field }) {
    let { defaultValue } = this.state;
    let _o = {
      [field]: value
    };
    let _defaultValue = { ..._o, ...defaultValue };
    this.setState({
      defaultValue: _defaultValue
    });
  }

  //这个关闭函数会执行onOk函数
  closeMenuAndOk() {
    //如果onOk方法存在的话会执行
    this.setState({ show: false });
    if (this.props.onOk) {
      this.props.onOk(this.state.selectedData);
    }
  }

  //这个关闭函数只是单纯的关闭
  onCancel() {
    this.setState({ show: false });
  }

  //切换方法
  onChange(value) {
    let { nowField, selectedData, defaultValue } = this.state;
    let _selectObj = {
      [nowField]: value
    };
    //新的选择项覆盖旧的
    let _selectedData = { ...selectedData, ..._selectObj };
    //设置默人数据
    let _defaultValue = { ...defaultValue, ..._selectedData };
    //设置选择项并且设置默认值
    this.setState({
      selectedData: _selectedData,
      defaultValue: _defaultValue
    });
    //如果有props有onChange属性将自动执行
    if (this.props.onChange) {
      this.props.onChange({ selectedData, nowField });
    }
  }

  //多选专用
  onOk(value) {
    let { nowField, selectedData, defaultValue } = this.state; //show
    //现在选择的
    let _selectObj = {
      [nowField]: value
    };
    //新的选择项覆盖旧的
    let _selectedData = { ...selectedData, ..._selectObj };
    //设置默人数据
    let _defaultValue = { ...defaultValue, ..._selectedData };
    //设置选择项并且设置默认值
    this.setState({
      show: false,
      selectedData: _selectedData,
      defaultValue: _defaultValue
    });
    if (this.props.onOk) {
      this.props.onOk(_selectedData);
    }
  }

  render() {
    const { initData, show, defaultValue, nowField } = this.state;
    // console.log(defaultValue[nowField]);
    const menuEl = (
      <Menu
        className={styles.multiFooMenu}
        data={initData}
        value={defaultValue[nowField]}
        onChange={this.onChange}
        onOk={this.onOk}
        onCancel={this.onCancel}
        height={document.documentElement.clientHeight * 0.6}
        {...this.props.Menu}
      />
    );

    return (
      <div className={styles.WFilter} {...this.props.other}>
        <div className={styles.navBar}>
          <WingBlank>
            <WhiteSpace />
            <Flex>
              {Array.isArray(this.props.children) ? (
                React.Children.map(this.props.children, child => {
                  return React.cloneElement(child, {
                    setData: this.setData,
                    _getData: this.getData,
                    onCancel: this.onCancel,
                    setDefaultValue: this.setDefaultValue
                  });
                })
              ) : (
                React.cloneElement(this.props.children, {
                  setData: this.setData,
                  _getData: this.getData,
                  onCancel: this.onCancel,
                  setDefaultValue: this.setDefaultValue
                })
              )}
            </Flex>
            <WhiteSpace />
          </WingBlank>
        </div>
        <div>{show ? menuEl : <div />}</div>

        {show ? (
          <div onClick={this.closeMenuAndOk} className={styles.menuMask} />
        ) : (
          <div />
        )}
      </div>
    );
  }
}

export default WFilter;
