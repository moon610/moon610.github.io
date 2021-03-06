# 历史

网景：JavaScript

微软：JScript

ECMA：ECMAScript(ES) (ECMA-262) (ES3、ES5、ES6)

[https://developer.mozilla.org/zh-CN/](https://developer.mozilla.org/zh-CN/)

# 语法基础

## 引入 JS

```html
<script></script>

<script type="text/javascript"></script>

<script src="js/outer.js"></script>
```

这个标签是可以放置在文件中的任意位置，但通常 `<script>` 标签放置在 `</body>` 之前。

`<script src="js/outer.js"></script>` 引入外部 JS 资源，在引入外部 JS 时，`<script>` 必须添加独立的 `</script>` 结束标签，在标签内部不能添加其它的额外 JS 代码。

## 输出

```js
console.log('打印输出日志信息')

document.write('写入文档，可包含 HTML 标签结构')
```

## 变量

变量是内存中一块数据存储的空间，主要用于保存需要进行运算的数据。

三要素：

- 变量名 - 通常变量名查找到在内存空间中的地址
- 变量值 - 内存空间中保存的数据
- 数据类型 - 保存某个数据时所分配的空间大小

JS 是弱类型的语言，在定义变量时，不需要指定数据类型。

### 定义变量

```js
var 变量名; // 变量声明
变量名 = 变量值; // 变量赋值

var 变量名 = 变量值; // 声明并赋值
```

如：

```js
// 定义变量，保存本金
var money; // 声明变量
money = 1000; // 变量赋值

// 定义变量，保存利率
var rate = 0.0175; // 变量声明并赋值

// 计算，使用变量名引用变量值
var result = money * rate;
```

### 使用变量

直接利用变量名引用变量值进行使用即可：

```js
console.log(result)
```

### 变量名命名规则：

- 可以包含的字符：字母、数字、下划线(`_`)、`$`
- 不能以数字开头
- 不能够是关键字

#### 关键字

关键字，是 JS 语言本身需要使用到的有特殊函义的单词，如：var、let、const、for、if、switch.......

### 变量命名规范：

- 选取简洁的英文单词作为变量名（见名知意）
- 采用(小)驼峰命名规范（第一个单词首字母小写，其它单词首字母大写，除首字母之外，其它所有字母小写）

## 数据类型

### 原始（基本）类型

- Number，数字，主要用于表示数字，`NaN`、`Infinity`
- String，字符串，主要用于表示文本数据，使用单引号 `''` 或双引号 `""` 将要表示的文本内容包含起来
- Boolean，布尔，主要用于表示条件的真假，有两个取值：`true`、`false`
- Undefined，未定义，有一个取值：`undefined`，如：变量只作声明没有赋值时，就是 `undefined`
- Null，空，有一个取值：`null`
- Symbol(ES6)，符号，表示唯一值，使用 `Symbol()` 语法来定义 Symbol 的值
- BigInt(ES11)，大整数，在需要表示的数字后添加字母 `n` 来表示是 BigInt 类型的数字

### 引用类型

- Object，对象，一系列属性数据的无序集合，表示方式：`{ name: '小明', age: 18 }`

## typeof 运算符

可以使用 typeof 求解某个表达式的数据类型，其求解的结果是一个字符串.

- 'number'
- 'string'
- 'boolean'
- 'undefined'
- 'object'
- 'symbol'
- 'bigint'
- 'function'

## 数据类型转换

### 显式类型转换（强制类型转换）

```js
parseInt()
parseFloat()
Number()
Boolean()
String()
```

- parseInt() / parseFloat() : 主要用于将字符串解析为数字，在解析字符串内容时，会有一定的容错能力。如果字符串中包含非法的数字，则解析到该第一个非法数字符号之前，如果第一个符号就是非法的符号，则返回 `NaN`
- Number()：主要用于将其它类型数据转换为数字，在将字符串转换为数字时，没有容错能力。
- Boolean()：主要用于将其它类型转换为布尔
- String()：主要用于将其它类型转换为字符串

### 隐式类型转换

由 JS 引擎在执行 JS 代码时，自动实现类型转换操作

## 运算符

### 算术运算符

- +
- -
- *
- /
- % （模，求余数）

### 条件运算符

- `>`
- `<`
- `>=`
- `<=`
- `===` / `==`
- `!==` / `!=`

利用条件运算符运算的结果，数据类型为 Boolean 类型，即结果取值为 true 或 false。

=== 与 == 的区别：

- == 在比较相等时，如果两边的表达式类型不一致，会先尝试自动转换为同种数据类型后比较，在类型一致的情况下再比较值是否相等。
- === 在比较相等时，会进行严格比较，即如果两边的类型不一致，则直接返回 false

在实际使用中，推荐使用 `===` 比较相等。

`!==` 与 `!=` 的区别与相等(`===` 与 `==`)判断的区别类似。`!==` 在判断不等时会严格区分类型，`!=` 在数据类型不一致时会先尝试转换类型。

### 逻辑运算符

- &&：并且
- ||：或者
- !：非

&& 与 || 也叫短路运算符。

&& 使用时，如果第一个表达式为 false，不再进行第二个表达式运算

|| 使用时，如果第一个表达式为 true，不再进行第二个表达式运算

### 赋值运算符

- =

将 `=` 右边的值赋值给左边的变量进行保存

### 复合运算符

结合了算术运算符与赋值运算符的使用：

- +=
- -=
- *=
- /=
- %=

利用运算符左侧的变量与运算符右侧的表达式进行运算，运算规则是运算符第一个符号的运算规则，将最终运算结果放回左侧变量空间中保存。

### 自增、自减运算符

- ++
- --

```js
var i = 10
i++ // ++i
console.log(i)
```

++ 作为后缀（如 i++ ），先引用，后运算（先使用 i 的值，后进行 i 自增运算）

++ 作为前缀（如 ++i），先运算，后引用（先进行 i 自增运算，再使用运算后的结果值）

