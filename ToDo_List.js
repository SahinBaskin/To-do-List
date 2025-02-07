// Tüm Elementleri Seçmek
const form = document.querySelector("#todoAddForm"); // form' un id' sini atadım
const addInput = document.querySelector("#todoName"); // input' un id' sini atadım
const todoList = document.querySelector(".list-group"); // ul' nin id' sini atadım
const firstCardBody = document.querySelectorAll(".card-body")[0]; // 2 adet div' i tek tek atadım
const secondCardBody = document.querySelectorAll(".card-body")[1];
const clearButton = document.querySelector("#clearButton"); // temizleme butonunun id' sini atadım
const filterInput = document.querySelector("#todoSearch"); // Filtreleme işlemini yapabilmek için .card-body içindeki input'un id' sini aldım.

let todos = [];

// const ile sabit değişkenlerimi belirledim.

runEvents();
function runEvents() {
    form.addEventListener("submit", addTodo); //burdaki fonksiyonda form' değişkenime submit edildiği zaman addTodo fonksiyonu devreye girsin dedim. runEvents(); fonksiyonumu öncesinde çalıştırdım.

    document.addEventListener("DOMContentLoaded", pageLoaded); // DOMContentLoaded eventi ile sayfa yüklendiğinde çalışsın diyoruz ve ne çalışsını da yanına virgülen sonra yazıyoruz. Virgülden sonra da fonksiyon ismini yazdık.

    secondCardBody.addEventListener("click", removeTodoToUI); // secondCardBody değişkenin ile daha önceden .card-body' nin 2. indeksinin atamasını yapmıştık. Burada ise secondCardBody değişkenine click eventi uygulanınca ne yapması gerektiğini belirliyoruz ve bunun için bir fonksiyon oluşturuyoruz.

    clearButton.addEventListener("click", allTodosEverywhere); // Tüm Todoları silmek için tüm todoları temizle butonuna bir click eventi ekledim.

    filterInput.addEventListener("keyup", filter); // filterInput değişkenine keyup eventi (klavyeden elimi kaldırınca bastığım tuş işesin) girdim vefilter fonksiyonunu ekledim.

}

function filter(e) { // fonksiyona e parametresini girdim
    const filterValue = e.target.value.toLowerCase().trim(); // gitdiğim sabit değişkene e parametresinin değerine tüm harfleri küçük yap ve sağdaki ve soldaki boşlukları kaldırma metotlarını girdim.

    const todoListesi = document.querySelectorAll(".list-group-item"); // Bu sabit değişkene ise  tüm .list-group-item class' ına sahip elementleri girdim. ve if döngüsü oluşturdum.

    if (todoListesi.length > 0) { // Oluşturduğum sabit değişkenimin uzunluğu sıfırdan büyükse..
        todoListesi.forEach(function (todo) { // forEach döngüsü başlat ve if içinde bir if döngüsü daha başlat
            if (todo.textContent.toLowerCase().trim().includes(filterValue)) { // Fonksiyona girmiş olduğum todo parametresi' nin textContent'inin tüm harflerini küçült, kenarlardaki boşlukları temizle ve includes metodu ile de gitmiş olduğumuz sabir değişken olan filterValue değişkeninin değerleri içinde var mı kontrol et.
                todo.setAttribute("style", "display:block"); // Varsa eğer display' ini block yap yani göster
            }
            else {
                todo.setAttribute("style", "display: none !important"); // Yoksa gösterme. Ancak burda normalde display' i sabit bir şekilde block gösterir, bu duruma devre dışı bırakmak için CSS' in !important özelliğini kullanırız.
            }
        })
    }
    else {
        showAlert("warning", "Filtreleme için en az 1 todo olmalıdır.")
    }
}

function allTodosEverywhere() {
    const todoList = document.querySelectorAll(".list-group-item"); // Sabit bir değişkene querySelactorAll ile tüm .list-group-item' classlarına sahip elementleri atadım.

    // Ekranda silme işlemi

    if (todoList.length > 0) { // Bir if döngüsü ile oluşturmuş olduğum değşkenimin uzunluğunu 0' dan büyük olursa eğer..
        todoList.forEach(function (todo) { // İf içine oluşturduğum forEach döngüsü ile belirttiğim remove metodunu todo' ya verdim
            todo.remove();
        });
        showAlert("success", "Tüm todo'lar silindi.."); // ve işlem başarılı olursa bir uyarı ile bilgilendirme mesajı girdim.

        // Storage' dan Silme

        todos = [];
        localStorage.setItem("todos", JSON.stringify(todos)); // localStorage' den silmek için setItem metodunu girdim.
        showAlert("succes", "Tüm todo'lar silindi..");

    }

    else {
        showAlert("warning", "Silmek için en az 1 todo olmalıdır!"); // Eğer ki todo listesinde silinecek bir todo yoksa (todoList.length < 0 (sıfırdan küçükse)) o zaman bir uyarı ile kullanıcıyı bilgilendirme mesajı verdim
    }

}

function pageLoaded() { // Bu fonksiyon ile DOMContentLoaded eventinin nasıl çalışması gerektiğini belirliyorum.
    checkTodosFromStorage(); // Başka biryerde oluşturup çalıştırdığım fonksiyonu buraya çağırıyorum aynı kodları tekrar tekrar yazmaktansa zaten var olanı burada da çalıştırıyorum
    todos.forEach(function (todo) {
        addTodoToUI(todo); // foreach döngüsünü kullanarak todos değişkenini çağırdım ve addTodoToUI(todo); fonksiyonunun içine atadım.
    })
    // Böylece sayfa her yenilendiğinde yada başlatıldığında önceden girmiş olduğumuz todo lar otomatik olarak yüklenecek.
}

function removeTodoToUI(e) { //Oluşturduğumuz fonksiyona (e) parametresini atayıp bu parametreye görevler yüklüyoruz.

    // Ekrandan Silmek:

    if (e.target.className === "fa fa-remove") { // Eğerki e parametresinin target'ının class adı fa fa-remove' a eşitse (katı eşitse) ona bazı işlemler gerçekleştireceğiz.
        const todo = e.target.parentElement.parentElement; // İşlemleri gerçekleştirmek için bir const değişkeni oluşturuyoruyoruz. Bu değişkene e.target' ın parentElement' inin parentElement'i ni atıyoruz, yani iki üst parent'ı.
        todo.remove(); // oluşturmuş olduğumuz değişkene remove() metodunu uyguluyoruz. Böylece fa fa-remove class' ına sahip elemente tıklandığında remove metodu devreye girecek ve tıklanan element silinecek.

        // Storage' den Silmek

        removeTodoToStorage(todo.textContent);
        showAlert("warning", "Todo başarıyla silindi."); // showAlert ile' de silme işlemi gerçekleşince success ( yeşil renkte) ve istenen text içeriğine sahip bir uyarı çıkacak.
    }
}

function removeTodoToStorage(removeTodo) {
    checkTodosFromStorage();
    todos.forEach(function (todo, index) {
        if (removeTodo === todo) {
            todos.splice(index, 1);
        }
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}

function addTodo(e) {
    const inputText = addInput.value.trim(); // Yeni bir sabit değişken ile inputText değişkenimdeki input' umun içine yazılacak değerlerin başındaki ve sonundaki boşlukları kaldırttım (trim metodu ile)

    if (inputText == null || inputText == "") {
        // alert("Lütfen bir değer giriniz!"); // Eğer ki inputText' in içi boş bırakılırsa yada içine bir şey yazılmazsa, bir alert ile kullanıcıyı uyar.
        showAlert("danger", "Lütfen boş bırakmayınız!"); // İlk girdiğim uyarı alert' ini iptal ettim yerine showAlert fonksiyonunu girdim. Parametreleri de ilkine class ismi ikincisine mesaj girişi yaptım.
    }
    else {
        // Arayüze Ekleme
        addTodoToUI(inputText); // İnput' un içerisi boş değilse de addTodoUI (inputText) yani addTodoUI fonksiyonunu çalıştır ve inputText' i içine yazdır.
        addTodoToStorage(inputText); // inputText ile inputun içerisine yazdırmış olduğumuz değeri burada localStorage'de de yazdırıyoruz. Bu değeri storage metoduna  veriyoruz.
        showAlert("success", "Todo Eklendi."); // showAlert fonksiyonunu çağırdım ve istenen parametreleri girdim.
    }

    // Storage Ekleme
    e.preventDefault(); // preventDefault(); ile default ( varsayılan) özellikleri iptal ettim
}

function addTodoToUI(newTodo) { // addTodoUI değişkenime newTodo parametresini atıyorum

    const li = document.createElement("li"); // li elementini oluşturdum
    li.className = "list-group-item d-flex justify-content-between"; // li' ye bir class adı girdim
    li.textContent = newTodo; // li' ye text içeriği olarak newTodo parametresini girdim. Çünkü newTodo parametresini addTodoUI' a verdim onun da içine inputText' i atadım. Yani inputText'in içine yazılacak olan değeri li' nin içine aktardım.

    const a = document.createElement("a"); // bir a elementi oluşturdum
    a.href = "#";
    a.className = "delete-item";

    const i = document.createElement("i"); // bir i elementi oluşturdum
    i.className = "fa fa-remove";


    //Burada en içten başlayarak element ekleme yaptım
    a.appendChild(i); // Öncelikle a' nın içine i' yi ekledim
    li.appendChild(a); // İçine i eklenmiş olan a'yı li' nin içine ekledim.
    todoList.appendChild(li); // İçine a eklenmiş olan li' yide todoList değişkenine ekledim. todolist değişkenimde yukarıda sabit değişken olarak aldığım ul oluyor.


    addInput.value = " "; // Son olarak da inputumun içine yazılan bir değerin tıklanma sonrası otomatik olarak null yani boş olmasını belirledim
}

function addTodoToStorage(newTodo) { // Çağırdığımız storage metodu da checkTodos metodunu çağırıyor.
    checkTodosFromStorage();
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function checkTodosFromStorage() {
    if (localStorage.getItem("todos") === null) { // check metodu diyorki; localStorage' de todos adında bir key var mı varsa içi boş mu, yoksa todos değişkenini temiz bir şekilde başlat.
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos")); // varsa eğer, o todos' un değerini al ve onu Array' e çevirerek todos değişkenine set' le.
    }
}

function showAlert(type, message) { // oluşturduğum fonksiyona 2 parametre girdim, bunlara girilecek değerler fonksiyonun işlevini gerçekleştirecek
    const div = document.createElement("div"); // div adında bir element oluşturdum
    div.className = "alert alert-" + type; // div elementine class ekliyorum ve adı alert + alert-type (burada type bizim girdiğimiz parametre ve type alanına ne yazılırsa buraya otomatik eklenecek)
    // div.className= `alert alert-${type}`; // Template Literals ile bu şekilde de kullanılabilir.
    div.textContent = message; // div' e bir içerik metni gireceğiz ve burda da message parametresini kullandım. Bu parametreye  yazılacak herhangi bir metin direk div' in içerisine yazılacak

    firstCardBody.appendChild(div); // appendChild ile oluşturmuş olduğumuz div' i firstcardBody değişkenine ekledik

    setTimeout(function () {// setTimeout = zamanı sonlandır metodu. İçine bir fonksiyon oluştururuz ve gerçekleşmesini istediğimiz işlevi yazarız.
        div.remove(); // Burada div' e remove metodunu girdik
    }, 2500) // Metodun sonuna virgül koyar ve zamanlama süresini gireriz, süre mili saniye cinsinde yazılır yani 1000 milisaniye = 1 saniye.
}