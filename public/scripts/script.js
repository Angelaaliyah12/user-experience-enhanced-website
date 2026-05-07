/*bron: https://github.com/fdnd-task/user-experience-enhanced-website/blob/main/docs/client-side-scripting-for-ux.md*/


const forms = document.querySelectorAll("form")/*selecteer alle forms op de pagina*/

forms.forEach(form => {/*voor elke form op de pagina, voeg een event listener toe voor het submitten van de form bron: https://www.google.com/search?q=meerdere+formulieren+selecteren+javascript&oq=meerdere+formulieren+selecteren+javas&gs_lcrp=EgZjaHJvbWUqBwgBECEYoAEyBggAEEUYOTIHCAEQIRigATIHCAIQIRifBTIHCAMQIRifBTIHCAQQIRifBTIHCAUQIRifBTIHCAYQIRifBTIHCAcQIRifBdIBCTEyNjM1ajBqN6gCALACAA&sourceid=chrome&ie=UTF-8 (optie 2)*/
  const button = form.querySelector("button")/*selecteer de button binnen de form, zodat we deze kunnen aanpassen tijdens het submitten*/

  form.addEventListener("submit", async function(event) {/*wanneer de form gesubmit wordt, voer deze functie uit*/
    event.preventDefault()/*voorkom dat de pagina ververst wordt bij het submitten van de form*/

    //  Loading state
    button.classList.add("loading")/*voeg een class toe aan de knop zodat we deze kunnen stylen tijdens het submitte*/
    button.textContent = "Saving..."/*verander de tekst van de button zodat de gebruiker weet dat er iets gebeurt*/

    let formData = new FormData(form)

    const response = await fetch(form.action, {
      method: form.method,
      body: new URLSearchParams(formData)
    })

    //  response checken en feedback geven aan de gebruiker
    if (response.ok) {
      button.classList.remove("loading")/*verwijder de loading class*/
      button.classList.add("saved")/*voeg class saved toe*/
      button.textContent = "Saved ✔"
    } else {
      button.classList.remove("loading")/*verwijder de loading class*/
      button.classList.add("error")/*voeg class error toe*/
      button.textContent = "Error✘"
    }

  })
})