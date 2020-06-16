移动端筛选组件

调用方法：(详情见help输出 
    <WFilter help ref={(el)=>{this.WFilter = el}}>  
        <WFilter.Item field="all" onClick={()=>{console.log('全部')}}>全部</WFilter.Item> 
        <WFilter.Item field="test" data={sData}>测试</WFilter.Item>
    </WFilter> 
