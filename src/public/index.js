const socket = io.connect();
let products = [];

socket.on('messages', data => {
    render(data);
});

socket.on('products', data => {
    renderTable(data.products);
});

function render(data) {
   data.forEach((elem) => {
        $("#messages").append(`
            <div> 
                <strong class="text-primary">${elem.email}</strong>
                <em class="text-brown">[${elem.date}]: </em> 
                <em class="fst-italic text-success">${elem.message}</em>
            </div>
        `)
    });
}

async function renderTable(productsData) {
    const response = await fetch("/tableProducts.handlebars");
    const source = await response.text();
    const template = Handlebars.compile(source);
    const context = { products: productsData };
    let html = template(context);
    $("#tableProducts").empty();
    $("#tableProducts").append(html);
}

$("#formChat").submit((e) => {
    e.preventDefault();
    const menssage = {
        email: $('#email').val(),
        date: new Date().toLocaleString(),
        message: $('#message').val(),
    };

    socket.emit('new-message', menssage);
    emptyInput('#message');

});

$("#formProduct").submit(async(e) => {
    e.preventDefault();
    const product = {
        title: $('#title').val(),
        price: $('#price').val(),
        thumbnail: $('#thumbnail').val(),
    };
    
    await socket.emit('new-product', product);
    emptyInput('#title');
    emptyInput('#price');
    emptyInput('#thumbnail');
});

function emptyInput(value) {
    $(value).val("");
}