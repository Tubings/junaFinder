// google api key: AIzaSyBFFbyG0U01RiiS861nQR5fgh3RFREwpNk

// Pistetään autorefresh pyörimään joka 15s, koska junat päivittävät sijaintinsa joka 15s.
$(function () {
  setInterval(autoRefresh, 15000);
});

function setup(juna) {
  //Haetaan tiedot junan sijainnista ja lähetetään ne eteenpäin
  $.ajax({
    url: "https://rata.digitraffic.fi/api/v1/train-locations/latest/" + juna,
    type: "GET",
    dataType: "json",
    success: function (data) {
      console.log("success", data);
      var lat = data[0].location.coordinates[1];
      var lon = data[0].location.coordinates[0];
      initMap2(lat, lon);
      autoRefresh();
    },
  });
}

function autoRefresh() {
  //tarkistetaan onko checkbox painettu ja jos on niin pyydetään uudestaan junan sijainti ja tehdään uusi kartta. jos checkbox ei painettu kerrotaan se konsolissa.
  if (document.getElementById("flexSwitchCheckDefault").checked) {
    var j = document.getElementById("juna").value;
    $.ajax({
      url: "https://rata.digitraffic.fi/api/v1/train-locations/latest/" + j,
      type: "GET",
      dataType: "json",
      success: function (data) {
        console.log("success", data);
        var lat = data[0].location.coordinates[1];
        var lon = data[0].location.coordinates[0];
        const juna = { lat: lat, lng: lon };
        const map = new google.maps.Map(document.getElementById("map"), {
          zoom: 12,
          center: juna,
        });
        const marker = new google.maps.Marker({
          position: juna,
          map: map,
        });
      },
    });
  } else {
    console.log("checkbox ei painettu");
  }
}

function initMap2(lat, lon) {
  //laitetaan kartta junan päälle ja luodaan nuppineula siihen kohtaan
  const juna = { lat: lat, lng: lon };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: juna,
  });
  const marker = new google.maps.Marker({
    position: juna,
    map: map,
  });
}

function initMap() {
  // Ladataan kartta joka osoittaa Helsingin päärautatieasemalle. Ladataan kartta heti, jotta näytöllä on jotain katseltavaa
  const hkipra = { lat: 60.1718, lng: 24.9414 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: hkipra,
  });
  // Ladataan nuppineula joka osoittaa rautatieasemalle
  const marker = new google.maps.Marker({
    position: hkipra,
    map: map,
  });
}

$("#juna").submit(function (e) {
  //estetään formia päivittämästä sivua kun painaa enteriä. Tein tämän jotta voin syöttää tietoa myös enterillä eikä tarvitse painaa nappia.
  e.preventDefault();
});

$("document").ready(function () {
  //luodaan eventlistenerit napille ja tekstikentälle. Jos tekstikentässä painaa enter se suorittaa napin koodin.
  $("#lähetä").click(function () {
    var j = document.getElementById("juna").value;
    setup(j);
  });
  $("#juna").keypress(function (e) {
    if (e.which == 13) {
      //Enter key pressed
      $("#lähetä").click();
    }
  });
});

function aktiivisetJunat() {
  // Tämä suoritetaan ensimmäisenä kun sivu aukeaa, jotta käyttäjä voi katsoa listasta jonkun aktiivisen junan numeron.
  // Alaosan teksti tulee näkyviin hitaasti.
  $("#testi").fadeTo("slow", 1);
  //luodaan muuttuja testi jotta siihen voidaan liittää tekstiä myöhemmin.
  var $testi = $("#testi");
  $.ajax({
    url: "https://rata.digitraffic.fi/api/v1/train-locations/latest/",
    type: "GET",
    dataType: "json",
    success: function (data) {
      console.log("success", data);
      //käydään kaikkien junien numerot läpi ja syötetään ne ruudun alaosassa olevaan laatikkoon.
      for (i = 0; i < data.length; i++) {
        $testi.append("<p>" + data[i].trainNumber + " </p>");
      }
    },
  });
}
