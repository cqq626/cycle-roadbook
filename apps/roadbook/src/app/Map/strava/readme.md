# 接口分析（20230630）

## PC

### 获取视图内的赛段

有登录态校验

```
https://www.strava.com/segments/explore/search?bounds=40.1573%2C116.2815%2C40.3146%2C116.6097&zoom=12&min_cat=0&max_cat=5&activity_type=Ride&_=1688041634057
```

| 参数          | 必填 | 示例值        | 分析                      |
| ------------- | ---- | ------------- | ------------------------- |
| bounds        | 是   |
| zoom          | 否   |
| min_cat       | 否   | 0             | 和坡度相关,数字越大坡越陡 |
| max_cat       | 否   | 5             | 和坡度相关,数字越大坡越陡 |
| activity_type | 否   | Ride          | 赛段类型                  |
| \_            | 否   | 1688041634057 |

### 获取赛段详细信息

```
https://www.strava.com/segments/explore/details?ids=30409229%2C15183773
```

| 参数 | 必填 | 示例值            | 分析    |
| ---- | ---- | ----------------- | ------- |
| ids  | 是   | 30409229,15183773 | 赛段 id |

返回的路线数据被加密了

## Mobile

### 获取视图内的赛段

接口返回的是二进制瓦片数据，有登录态校验

- [ ] 二进制解析方式和取数逻辑
- [ ] 坐标参数

```
https://cdn-1.strava.com/tiles/segments/114258149/10/842/388?intent=default&activity_types=Ride&elevation_filter=all&surface_types=0&distance_min=0
```

| 参数      | 必填 | 示例值    | 分析           |
| --------- | ---- | --------- | -------------- |
| 114258149 | 是   | 114258149 | 应该是数据版本 |
| 10        | 是   | 10        | 缩放级别       |
| 842/388   | 是   | 842/388   | x/y            |

拓展阅读：

- [ ] https://github.com/mapbox/mapbox-gl-js/blob/main/ARCHITECTURE.md
- [ ] https://github.com/mapbox/vector-tile-js
