# Прочие
Эти типы данных таже очень важны, но мы поговорим о них подробнее в отдельно отведённых для них блоках.

### Функция
Обычная функция языка. Пример:
```go
void func myFunc() {} 
```

### Классы, импликации и интерфейсы
```go
class Cat {
    wait str name;
    void func meow() {
        print("meow!");
    }
}
interface Robot {
    void func doWork();
}
impl Constructor Robot {
    public void func doWork() {
        print("I'am working!");
    }
}
```

### Объекты классов и импликации
```go
Car barsik = new Cat("barsik");
barsik.meow();
Constructor con = new Constructor();
```