JRS - JSON Request Structure
============================

Công cụ cấu trúc dữ liệu theo định dạng JSON trước khi gửi đi bằng AJAX, POST...

## Giới thiệu


Theo truyền thống dữ liệu truyền từ client lên server thường được lưu dưới định dạng JSON, vd:

```json
{
    "id":3456,
    "fullName":"Harry Potter",
    "company":"Hogwarts"   
}
```

Việc này tạm thời giải quyết vấn đề giao tiếp từ client đến server, nhưng khi cần thêm một số dữ liệu mang tính mô tả như:
authentication,  cách thức xử lý dữ liệu gửi lên (thêm, tìm kiếm hay chỉnh sửa???), cách thức trả về,... thì có thể gây
nhầm lẫn giữa các thông tin đó và dữ liệu cần xử lý:

```json
{
    "mode":"create",
    "token":"dju4gwg85iwtgi349857684hfki7whwnrt",
    "id":3456,
    "fullName":"Harry Potter",
    "company":"Hogwarts"   
}
```
Vậy yêu cầu đặt ra là cần phải có một quy định về cách tổ chức dữ liệu gửi lên server, để có thể xác định các thông tin này rõ ràng.
JRS giải quyết vấn đề đó bằng cấu trúc như sau:

```json
{
    "meta": {
        //Các thông tin mang tính mô tả
    }, 
    "data":{
        //Dữ liệu chính cần truyền đi
    }
     //...
     //... Các field khác nếu cần thiết, nhằm tương thích với các hệ thống mà không thể thay đổi hay các thông tin khác
}
```

Như vậy với cấu trúc của JRS thì data như trên có thể được tái cấu trúc như sau:

```json
{
    "meta":{
        "mode":"update",
        "token":"dju4gwg85iwtgi349857684hfki7whwnrt"
    },
    "data":{
        "id":3456,
        "fullName":"Harry Potter",
        "company":"Hogwarts"   
    }
}
```
hoặc truyền đi data dạng mảng:

```json
{
    "meta":{
        "mode":"create",
        "token":"dju4gwg85iwtgi349857684hfki7whwnrt"
    },
    "data":[
        {
            "fullName":"Harry Potter",
            "company":"Hogwarts"   
        },
        {
            "fullName":"Tom Riddle",
            "company":"Hogwarts"   
        }
    ]
}
```

```json
{
    "meta":{
        "mode":"remove",
        "token":"dju4gwg85iwtgi349857684hfki7whwnrt"
    },
    "data":[245, 578]
}
```
## Hướng dẫn sử dụng
### 1. Tạo mới
```js
var jrs = new JRS(); //Tạo instance
```
### 2. Thêm Data, kiểm tra, lấy về và remove các data đã thêm
```js
//Thêm một
jrs.addData('id', 3456); 
//Thêm nhiều
jrs.addData({
    "fullName": "Harry Potter",
    "company":"Hogwarts"
});

//Kiểm tra tồn tại của một data
console.log('Has fullName???', jrs.hasData('fullName')); //Has fullName??? true
console.log('Has salary???', jrs.hasData('salary')); //Has salary??? false

//Lấy về các data đã thêm
console.log('All Data', jrs.data()); //All Data {"id":3456, "fullName":"Harry Potter", "company":"Hogwarts"}

//Lấy về 1 data, nếu data có tồn tại sẽ trả về dữ liệu của data đó, không thì trả về giá trị mặc định (tùy chọn, mặc định là undefined)
console.log('fullName is', jrs.data('fullName')); //fullName is Harry Potter
console.log('salary is', jrs.data('salary')); //salary is undefined
console.log('salary is', jrs.data('salary', 0)); //salary is 0

//Remove data
jrs.removeData('fullName', "missingDataName", "id");
```

### 3. Meta, Field
Các phần meta và field tương tự như phần data, cũng có các method như addMeta, meta, hasMeta, removeMeta, addField, fields,...
```js
//Thêm meta
jrs.addMeta('token', "dju4gwg85iwtgi349857684hfki7whwnrt");
jrs.addMeta({
    "method": "update"
});

//Thêm field
jrs.addField('structure', 'JRS');
jrs.addField({
    "version": "0.1.1"
});
```
### 4. Export
JRS có thể xuất các thông tin ra 1 object chứa các info về meta, data, fields

```js
var exp_data = jsr.export();
console.log(exp_data); 
//{
//   meta: {
//        "token":"........"
//        ......
//    },
//    data: {
//        id: 3456,
//        fullName: "Harry Potter",
//        .....
//   },
//    version: "0.1.1"
//    structure: "JRS",
//    ......
//}
```

### 5. Import
Một JRS instance có thể import từ một JRS instance khác hoặc data object đã được export của JRS instance đó, việc này giúp kế thừa, cấu hình các JRS dễ dàng

```js
var defaultJRS = new JRS();
defaultJRS.addMeta("token", "Tooi bij ddien");

var otherJRS_1 = new JRS();
otherJRS_1.data('fullName', 'Harry Potter');
otherJRS_1.import(defaultJRS, true); //Import từ instance khác và cho phép ghi đè
otherJRS_1.import(defaultJRS.export()); //Import từ exported data và không cho phép ghi đè

//Import khi tạo instance và cho phép ghi đè
var otherJRS_2 = new JRS(defaultJRS, otherJRS_1.export(), true);
```

### 6. Chuyển dữ liệu cũ theo định dạng mới của JRS???
Dữ liệu cũ có thể chuyển về theo định dạng của JRS dễ dàng bằng cách dùng static method transform của JRS như sau:

```js
var jrs = JRS.transform(<<Old DATA Object>>[, <<Option object>>])
```
Hàm transform nhận 2 đối số:
* Old data: object chứa các field data
* option: tùy chọn, hướng dẫn cách transform, bao gồm 3 field: meta, data, fields. Mặc định meta và fields là [], data là true. Các field này nếu có giá trị là true thì tất cả key hiện có trong old data sẽ gôm vào thành kiểu field đó, vd: khi data là true thì tất cả key old data là data, khi meta là true thì tất cả field là meta, tương tự với fields. Nếu field là array thì sẽ lọc old data lấy các key tương ứng với array đó

Độ ưu tiên giữa các field là: data >> meta >> fields

```js
var oldData = {
    "version":"0.1.1",
    "mode":"create",
    "token":"dju4gwg85iwtgi349857684hfki7whwnrt",
    "id":3456,
    "fullName":"Harry Potter",
    "company":"Hogwarts",
    structure: 'JRS'
};
var jrs = JRS.transform(oldData);
//jrs có data là tất cả các key của oldData (mặc định của option là data = true)

var jrs = JRS.transform(oldData, {model: true});
//jrs có meta là tất cả các key của oldData, và không có data (và fields) vì model đã lấy hết key của oldData

var jrs = JRS.transform(oldData, {model: ['mode', 'token'], data: ['id', 'fullName', 'company'], fields: true});
//jrs có:
// - meta: mode, token
// - data: id, fullName, company
// - fields: version, structure (các key còn lại)
//
// Nếu export data thì ta sẽ có
//{
//   meta: {
//        "token":"dju4gwg85iwtgi349857684hfki7whwnrt",
//        "mode" : 'create'
//    },
//    data: {
//        id: 3456,
//        fullName: "Harry Potter",
//        company: "Hogwarts"
//   },
//    version: "0.1.1"
//    structure: "JRS"
//}
```
