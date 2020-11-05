# Practicas-Programacion-Web
Para las practicas de Prog web

## Practica 2:

Examen Parcial
Se debe entregar un enlace a una release a un repositorio privado de github. El repositorio se debe compartir con el usuario avalero.

Se pide realizar una API REST utilizando Deno y el servidor oak. La práctica debe trabajar con una base de datos Mongo alojada en Mongo Atlas.

Se desea implementar una API para la emisión de facturas de una empresa.

Añadir clientes.
Añadir productos.
Crear facturas.
Consultar facturas.
API
GET /status
Indica que la API etá lista.

Responses:
200 OK When the service is ready to receive requests.
500 Server Error Si hay un error inesperado (no controlado) de cualquier tipo

POST /client (2 puntos)
Añade a la DDBB los clientes.
Debe comprobar que el cliente no existe en la DDBB (busqueda por CIF).
El cliente debe tener CIF, name y address. Puede tener (pero no es necesario) phone y mail.
Request:
Body El cliente.
Content Type application/json

Ejemplo:

  {
    "cif": "B51287562J",
    "name": "Universidad Nebrija",
    "address": "Calle Pirineos 8, 28283 Madrid",
    "mail": "billing@nebrija.es" 
}
Responses:
200 OK Cuando todo es OK.
400 Bad Request Cuando hay un error en la petición (por ejemplo, falta alguno de los campos).
500 Server Error Si hay un error inesperado (no controlado) de cualquier tipo


POST /product (2 puntos)
Añade a la DDBB un producto.
Debe comprobar que el producto no existe en la DDBB (busqueda por SKU).
El producto debe tener sku, name y price.
Request:
Body El producto.
Content Type application/json

Ejemplo:

  {
    "sku": "H12213",
    "name": "Boligrafo color rojo",
    "price": 2 
}
Responses:
200 OK Cuando todo es OK.
400 Bad Request Cuando hay un error en la petición (por ejemplo, falta alguno de los campos o el precio es negativo).
500 Server Error Si hay un error inesperado (no controlado) de cualquier tipo
POST /invoice (3 puntos)
Se crea una factura. La factura contiene:

CIF del cliente (debe existir en la base de datos).
Lista y cantidad de productos (identificados por SKU, deben estar en la base de datos)
Request
Body La información de la factura
Content Type application/json

Ejemplo:

{
  "clientCIF": "B51287562J",
  "products": [ { "sku": "H22334", "amount": 5, }, { "sku": "H233434", "amount": 1, }, { "sku": "H24334", "amount": 2, } ] 
}
Al añadir una factura se le asigna un id (el _id que genera automáticamente Mongo)

Responses:
200 OK or 202 Accepted Factura creada correctamente. En el cuerpo de la respuesta se debe incluir el id de la factura (_id de Mongo).
400 Bad Request Cuando la solicitud es incorrecta, por ejemplo, una cantidad negativa.
404 Not Found No se encuentra el cliente o alguno de los productos.
500 Server Error Si hay un error inesperado (no controlado) de cualquier tipo
GET /invoice/:ID (3 puntos)
Se solicita una factura con un ID determinado. Se debe devolver un JSON que contenga.

Cliente
CIF
Nombre
Dirección
Telefono si lo tiene
Mail si lo tiene
Lista de productos:
SKU
Nombre
Cantidad
Precio total.
Precio Total.
Por ejemplo:

{
  "client": { 
 "CIF": "B51287562J", 
 "mame": "Universidad Nebrija", 
 "direccion": "Calle Pirineos 8", 
 "mail": "billing@nebrija.es", 
 "products": [ 
 { 
 "sku": "H22334", 
 "name": "boli rojo", 
 "amount": 5, 
 "totalPrice": 12, 
 }, 
 { 
 "sku": "H23334", 
 "name": "boli azul", 
 "amount": 2, 
 "totalPrice": 5, 
 }, 
 ], 
 "totalPrice": 17 
 } 
Responses:
200 OK con la factura en el cuerpo de la respuesta.
404 Not Found La factura no existe.
500 Server Error Si hay un error inesperado (no controlado) de cualquier tipo