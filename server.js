// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs';

// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Maak werken met data uit formulieren iets prettiger
app.use(express.urlencoded({ extended: true }))

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid()
app.engine('liquid', engine.express())

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
app.set('views', './views')


console.log('Let op: Er zijn nog geen routes. Voeg hier dus eerst jouw GET en POST routes toe.')

app.locals.opgeslagen = [];

// Maak een GET route voor de index (meestal doe je dit in de root, als /)
app.get('/', async function (request, response) {

  const params = {
    fields: '*'
  }

  const productResponse = await fetch(
    'https://fdnd-agency.directus.app/items/milledoni_products?' +
    new URLSearchParams(params)
  )

  const productResponseJSON = await productResponse.json()

  response.render('index.liquid', {
    products: productResponseJSON.data
  })

})

app.get('/lijst', async function (request, response) {

  const userId = 61; // mijn user ID
  const params = {
    'filter[milledoni_users_id][_eq]': userId,
    'fields': '*,milledoni_products_id.*'
  };

  const productResponse = await fetch('https://fdnd-agency.directus.app/items/milledoni_users_milledoni_products_1?' +
    new URLSearchParams(params)
  )
  const productResponseJSON = await productResponse.json();

  response.render('lijst.liquid', {
    products: productResponseJSON.data
  });

});

// app.get('/lijst', function (request, response) {

//   response.render('lijst.liquid', {
//     products: app.locals.opgeslagen
//   })

// });


app.post('/opslaan', async function (request, response) {

  const productId = request.body.productId;

  await fetch('https://fdnd-agency.directus.app/items/milledoni_users_milledoni_products_1', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },//headers= uitleg over je date> Deze data dat ik stuur is json// 

    body: JSON.stringify({ //body=het lichaam van je request
      milledoni_users_id: 61,
      milledoni_products_id: productId
    })
  });

  response.redirect('/lijst');
});


// app.post('/opslaan', async function (request, response) {

//   const productId = request.body.productId;

//   const productResponse = await fetch(
//     'https://fdnd-agency.directus.app/items/milledoni_products/' + productId
//   )

//   const productResponseJSON = await productResponse.json()

//   app.locals.opgeslagen.unshift(productResponseJSON.data) /*unsift is tegenovergestelde van push de nieuw item komt dan als eerst in de array*/

//   response.redirect('/lijst') 
// })
app.post('/verwijder', async function (request, response) {

  const id = request.body.id;
  await fetch(
    'https://fdnd-agency.directus.app/items/milledoni_users_milledoni_products_1/' + id,
    {
      method: 'DELETE'
    }
  );

  response.redirect('/lijst');

});

app.get('/valentijnsdag', async function (request, response) {

  const params = {
    fields: '*',
    'filter[tags][_contains]': 'valentijnsdag'
  }

  const productResponse = await fetch(
    'https://fdnd-agency.directus.app/items/milledoni_products?' +
    new URLSearchParams(params)
  )

  const productResponseJSON = await productResponse.json()

  response.render('valentijnsdag.liquid', {
    products: productResponseJSON.data
  })

})

app.get('/:tags', async function (request, response) {
  const params = {
    fields: 'image,name',
    'filter[tags][_contains]': request.params.tags
  }

  const productResponse = await fetch(
    'https://fdnd-agency.directus.app/items/milledoni_products?' +
    new URLSearchParams(params)
  )

  const productResponseJSON = await productResponse.json()

  response.render('index.liquid', {
    products: productResponseJSON.data
  })

})

app.get('/product/:id', async function (request, response) {

  const id = request.params.id

  const productResponse = await fetch(
    'https://fdnd-agency.directus.app/items/milledoni_products/' + id
  )

  const productResponseJSON = await productResponse.json()

  response.render('product.liquid', {
    product: productResponseJSON.data
  })

})
app.get('/product', async function (request, response) {

  const params = {
    fields: '*'
  }

  const productResponse = await fetch(
    'https://fdnd-agency.directus.app/items/milledoni_products?' +
    new URLSearchParams(params)
  )

  const productResponseJSON = await productResponse.json()

  response.render('product.liquid', {
    products: productResponseJSON.data
  })

})
/*
// Zie https://expressjs.com/en/5x/api.html#app.get.method over app.get()
app.get(…, async function (request, response) {
  
  // Zie https://expressjs.com/en/5x/api.html#res.render over response.render()
  response.render(…)
})
*/

/*
// Zie https://expressjs.com/en/5x/api.html#app.post.method over app.post()
app.post(…, async function (request, response) {

  // In request.body zitten alle formuliervelden die een `name` attribuut hebben in je HTML
  console.log(request.body)

  // Via een fetch() naar Directus vullen we nieuwe gegevens in

  // Zie https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch over fetch()
  // Zie https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify over JSON.stringify()
  // Zie https://docs.directus.io/reference/items.html#create-an-item over het toevoegen van gegevens in Directus
  // Zie https://docs.directus.io/reference/items.html#update-an-item over het veranderen van gegevens in Directus
  const fetchResponse = await fetch(…, {
    method: …,
    body: JSON.stringify(…),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })

  // Als de POST niet gelukt is, kun je de response loggen. Sowieso een goede debugging strategie.
  // console.log(fetchResponse)

  // Eventueel kun je de JSON van die response nog debuggen
  // const fetchResponseJSON = await fetchResponse.json()
  // console.log(fetchResponseJSON)

  // Redirect de gebruiker daarna naar een logische volgende stap
  // Zie https://expressjs.com/en/5x/api.html#res.redirect over response.redirect()
  response.redirect(303, …)
})
*/


// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000; als deze applicatie ergens gehost wordt, waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, gebruik daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console
  console.log(`Daarna kun je via http://localhost:${app.get('port')}/ jouw interactieve website bekijken.\n\nThe Web is for Everyone. Maak mooie dingen 🙂`)
})
