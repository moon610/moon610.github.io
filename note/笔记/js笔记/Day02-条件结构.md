# Review

**变量：**变量名、变量值、数据类型

**数据类型：**Boolean、String、Number、Null、Undefined、Symbol、BigInt、Object

**typeof：**`'boolean'`、`'string'`、`'number'`、`'object'`、`'undefined'`、`'symbol'`、`'bigint'`、`'function'`

**数据类型转换：**parseInt()、parseFloat()、Number()、Boolean()、String()

**运算符：**

- 算术运算符 ：+、-、*、/、%。
  - 使用 `+` 号时，需要注意，如果 `+` 号两边的表达式都是数字，则进行算术的加，如果有任何一个为字符串的值，则进行的是**字符串拼接操作**
- 条件运算符（关系运算符）：>、<、>=、<=、===、==、!==、!=
- 逻辑运算符：&&、||、!
- 赋值运算符：=
- 自增、自减：++、--
  - 前缀：先运算，后引用
  - 后缀：先引用，后运算
- 复合运算符：+=、-=、*=、/=、%=

**NaN与任何的值都不相等，包括它自身**

**练习：**

* 为抵抗洪水，战士连续作战89小时，编程计算共多少天零多少小时？

```js
var days = parseInt(89 / 24)
var hours = 89 % 24
```

* 小明要到美国旅游，可是那里的温度是以华氏度为单位记录的。它需要一个程序将华氏温度（80度）转换为摄氏度，并以华氏度和摄氏度为单位分别显示该温度。
  * 提示：摄氏度与华氏度的转换公式为：摄氏度 = 5/9.0*(华氏度-32) 。保留3位小数

```js
var c = 5 / 9.0 * (80 - 32)
c = c.toFixed(3)
```

**toFixed(num) 表示将数字转换为字符串，保留小数点后指定 num 位的小数字符**

* 计算两个文本框中输入数字的和

* var k=0;  console.log(k++ + ++k +k +k++)

  ```js
  var k=0
  // var result = K++ + 5 // result = 5   k = 1
  console.log(k++ + ++k +k +k++) // k = 3
  console.log(0 + 2 + 2 + 2)
  ```

* 计算两个文本框的加减乘除



# 流程控制语句

- 顺序结构：按照代码书写的先后顺序依次执行
- 选择结构（条件结构、分支结构）
- 循环结构

## 选择结构

有条件的执行操作，在满足条件的情况下执行，不满足条件由不执行。

### 语法

```js
if(条件表达式) {
    // 语句块
    // 在条件表达式为 true 时执行的语句块
}
```

```js
if(条件表达式) {
    // 语句块
    // 在条件表达式为 true 时执行的语句块
} else {
    // 语句块
    // 当条件表达式为 false 时执行的语句块
}
```

```js
if(条件表达式1) {
    // 语句块
    // 在条件表达式1为 true 时执行的语句块
} else if(条件表达式2) {
    // 语句块
    // 在条件表达式1为 false，条件表达式2为 true 时执行的语句块
} else if(...) {
    // statement
} else {
    // 语句块
    // 当所有条件均为 false 时执行的语句块
}
```

当 if 或 else 语句块中**只一条可执行语句时，可以省略 `{}`** 的书写。

```js
switch(表达式) {
    case 常量1:
        // 当 (表达式 === 常量1) 相等时，执行该语句块
        break // 退出选择结构
    case 常量2:
        // 当 (表达式 === 常量2) 相等时，执行该语句块
        break
    case ...:
        // ......
        break
    default:
        // 当前述所有条件都不满足时，执行默认语句块
}
```

通常 switch 用于等值条件判断。

case 语句块中的 `break` 语句是可以省略的，当省略 `break` 语句时，会导致 case 语句贯穿

多重 if 与 switch 通常都是多重条件判断，在选择使用时，一般等值条件判断优先选择使用 `switch`。

### 流程图：

比如：他说他喜欢他

使用文字描述可能会产生歧义，使用图形描述会更形象（一图胜千言）