let map;
let marker;
let lightConeLayers = [];
let userLocation;
let scooterMarkers = [];
let lastClickedMarker = null;
let lastPolyline = null;
// Function to decrypt data
function decryptData(encryptedData, secretKey) {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

// Function to set data in localStorage with expiration
function getDataWithExpiration(key, secretKey) {
  const storedData = localStorage.getItem(key);
  if (!storedData) return null; // No data found

  const { encryptedData, expiration } = JSON.parse(storedData);
  if (Date.now() > expiration) {
    localStorage.removeItem(key); // Remove expired data
    return null; // Data is expired
  }
  return decryptData(encryptedData, secretKey); // Decrypt and return valid data
}
const secretKey = "jnvmnjofmcivneirp"; // Use the same secret key for decryption
const storedData = getDataWithExpiration("userData", secretKey);

if (storedData) {
  console.log("Valid User Data:", storedData);
  document.getElementById("profileName").innerText =
    storedData.data.user.fullname;
  document.getElementById(
    "ProfileBalance"
  ).innerText = `${storedData.data.user.wallet} EGP`;
  // document.getElementById(
  //   "ProfileBalance"
  // ).innerText = `50 EGP`;
  document.getElementById(
    "currentBalance"
  ).innerText = `${storedData.data.user.wallet} EGP`;
  // document.getElementById(
  //   "currentBalance"
  // ).innerText = `50 EGP`;
} else {
  window.location.href = "/login.html";
}
function initMap() {
  const allowedAreaCoords = [
    // { lat: 29.43416116753383, lng: 32.398229305394274 }, //clockwise
    // { lat: 29.428112234806424, lng: 32.406130081142265 },
    // { lat: 29.426336659581768, lng: 32.40418038885533 },

    // { lat: 29.425365681039345, lng: 32.40310489012659 },

    // { lat:  29.42490631641892, lng: 32.40185596207526},

    { lat: 29.433953161959348, lng: 32.39822772882634 },
    { lat: 29.428018496431843, lng: 32.40608020705056 },
    { lat: 29.4266729595748, lng: 32.4046250947197 },
    { lat: 29.42610905709875, lng: 32.40386228256005 },
    { lat: 29.425707065283987, lng: 32.40340715931385 },
    { lat: 29.425422320133176, lng: 32.40293921572012 },
    { lat: 29.4251934067861, lng: 32.402612296223126 },
    { lat: 29.425025908888227, lng: 32.40224050542262 },
    { lat: 29.424925410016943, lng: 32.40192640629806 },
    { lat: 29.424774661523593, lng: 32.401420001587034 },
    { lat: 29.42469649555006, lng: 32.401035390414094 },
    { lat: 29.424623912806506, lng: 32.40050975514442 },
    { lat: 29.42460157964421, lng: 32.39988796708152 },
    { lat: 29.42454622221076, lng: 32.39988200709399 },
    { lat: 29.424579721970634, lng: 32.39939483294162 },
    { lat: 29.424646721457204, lng: 32.398965350465176 },
    { lat: 29.424808636707333, lng: 32.39836920314543 },
    { lat: 29.425093383578417, lng: 32.397606390985786 },
    { lat: 29.42548421131751, lng: 32.39685639919856 },
    { lat: 29.426076033342195, lng: 32.396125637942475 },
    { lat: 29.426388919481887, lng: 32.395851323913725 },
    { lat: 29.42706650954878, lng: 32.39535189369641 },
    { lat: 29.42794486029904, lng: 32.394977321041836 },
    { lat: 29.42838432650709, lng: 32.39487110834438 },
    { lat: 29.429277816282433, lng: 32.394788377710206 },
    { lat: 29.43025776377204, lng: 32.39492074672488 },
    { lat: 29.431302550313013, lng: 32.39540058440305 },
    { lat: 29.431760433339495, lng: 32.39571493404536 },
    { lat: 29.43225100207741, lng: 32.3961494518894 },
    { lat: 29.43263137568737, lng: 32.39654083771388 },
    // { lat: 29.433020695798607, lng: 32.397259568173794 },
    // 29.43301878738705,
    // 32.39725847256929,
    { lat: 29.433623757350247, lng: 32.39764522843716 },

    // { lat: 29.424899318991706, lng: 32.401327568554116 },
    // { lat: 29.42480362621095, lng: 32.40139236526825 },
    // { lat: 29.424504269700655, lng: 32.39899398358149 },
    // { lat: 29.426469027103323, lng: 32.39547652573889 },
    // { lat: 29.42773444395368, lng: 32.394807444084044 },
    // { lat: 29.430256508020427, lng: 32.39466636179888 },

    // { lat: 29.43243433640224, lng: 32.39629615589869 },

    // { lat: 29.428141973166152, lng: 32.40542065520622 },
    // { lat: 29.433511227490385, lng: 32.39844163472097 },

    // { lat: 29.431638958784, lng: 32.3959976986121 },
  ];
  const defaultLocation = { lat: 29.429244286408938, lng: 32.400136266050254 };
  const mapOptions = {
    zoom: 18,

    center: defaultLocation,

    mapTypeControl: false, // Hide the Map, Satellite, Styled Map buttons
    zoomControl: false, // Hide the + and - buttons for zooming
    fullscreenControl: false, // Hide fullscreen button
    streetViewControl: false,
  };

  //map style
  const styledMapType = new google.maps.StyledMapType(
    [
      { elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#523735" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e6" }] },
      {
        featureType: "landscape.man_made",
        elementType: "geometry.stroke",
        stylers: [{ color: "#8c4a2f" }], // Darker brown stroke for buildings
      },

      {
        featureType: "all",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#f5f1e6" }],
      },
      {
        featureType: "road.local",
        elementType: "geometry",
        stylers: [{ color: "#9e9e9e" }], // Gray color for roads
      },
      // {
      //   featureType: "administrative",
      //   elementType: "geometry.stroke",
      //   stylers: [{ color: "#c9b2a6" }],
      // },
      // {
      //   featureType: "administrative.land_parcel",
      //   elementType: "geometry.stroke",
      //   stylers: [{ color: "#dcd2be" }],
      // },
      // {
      //   featureType: "administrative.land_parcel",
      //   elementType: "labels.text.fill",
      //   stylers: [{ color: "#ae9e90" }],
      // },
      // {
      //   featureType: "landscape.natural",
      //   elementType: "geometry",
      //   stylers: [{ color: "#dfd2ae" }],
      // },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [{ color: "#dfd2ae" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#93817c" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry.fill",
        stylers: [{ color: "#a5b076" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#447530" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#f5f1e6" }],
      },
      {
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [{ color: "#fdfcf8" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#f8c967" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#e9bc62" }],
      },
      {
        featureType: "road.highway.controlled_access",
        elementType: "geometry",
        stylers: [{ color: "#e98d58" }],
      },
      {
        featureType: "road.highway.controlled_access",
        elementType: "geometry.stroke",
        stylers: [{ color: "#db8555" }],
      },
      {
        featureType: "road.local",
        elementType: "labels.text.fill",
        stylers: [{ color: "#806b63" }],
      },
      {
        featureType: "transit.line",
        elementType: "geometry",
        stylers: [{ color: "#dfd2ae" }],
      },
      {
        featureType: "transit.line",
        elementType: "labels.text.fill",
        stylers: [{ color: "#8f7d77" }],
      },
      {
        featureType: "transit.line",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#ebe3cd" }],
      },
      {
        featureType: "transit.station",
        elementType: "geometry",
        stylers: [{ color: "#dfd2ae" }],
      },
      {
        featureType: "water",
        elementType: "geometry.fill",
        stylers: [{ color: "#b9d3c2" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#92998d" }],
      },
    ],
    { name: "Styled Map" }
  );

  // Create the map
  const map = new google.maps.Map(document.getElementById("map"), mapOptions);
  let isSatelliteView = false;

  // Add event listener to the scope icon button
  document.getElementById("scopeButton").addEventListener("click", function () {
    if (isSatelliteView) {
      map.setMapTypeId("styled_map"); // Switch back to the original map type
    } else {
      map.setMapTypeId(google.maps.MapTypeId.SATELLITE); // Switch to satellite view
    }
    isSatelliteView = !isSatelliteView; // Toggle the view state
  });

  //Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set("styled_map", styledMapType);
  map.setMapTypeId("styled_map");

  // Create the polygon for the allowed area

  // // Generate the half-circle polygon
  // const halfCircle = createHalfCircle(center, 0.001, 180, 0);

  // // Create the polygon for the half-circle
  // const halfCirclePolygon = new google.maps.Polygon({
  //   paths: halfCircle,
  //   strokeColor: "#FF0000",
  //   strokeOpacity: 0.8,
  //   strokeWeight: 2,
  //   fillColor: "#FF0000",
  //   fillOpacity: 0.35,
  // });
  //   halfCirclePolygon.setMap(map);

  //  function createHalfCircle(center, radius, startAngle, endAngle) {
  //       const points = [];
  //       const angleStep = (endAngle - startAngle) / 100; // Adjust the number of segments

  //       // Calculate the points along the arc
  //       for (let angle = startAngle; angle <= endAngle; angle += angleStep) {
  //         const angleRad = (angle * Math.PI) / 180; // Convert to radians
  //         const lat = center.lat + radius * Math.cos(angleRad);
  //         const lng = center.lng + radius * Math.sin(angleRad);
  //         points.push({ lat: lat, lng: lng });
  //       }
  //     points.push(center);
  //      return points;
  //   }
  //
  const allowedAreaPolygon = new google.maps.Polygon({
    paths: allowedAreaCoords,
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#ffc75f",
    fillOpacity: 0.35,
  });

  allowedAreaPolygon.setMap(map);

  //  const allowedAreaParking = [
  //    { lat: 29.43036704144054, lng: 32.40203346580507 },
  //    { lat: 29.430559767800222, lng: 32.4022440192048 },
  //    { lat: 29.43008667888246, lng: 32.40292768187111 },
  //    { lat: 29.42995001777399, lng: 32.402760043814 },

  //    { lat: 29.431638958784, lng: 32.3959976986121 },
  //  ];
  //    const allowedAreaParkingPolygon = new google.maps.Polygon({
  //      paths: allowedAreaParking,
  //      strokeColor: "#FF88",
  //      strokeOpacity: 0.8,
  //      strokeWeight: 2,
  //      fillColor: "#ffc7",
  //      fillOpacity: 0.35,
  //    });

  //  allowedAreaParkingPolygon.setMap(map);
  const parkingLot1 = [
    { lat: 29.42641, lng: 32.399978 },

    { lat: 29.426488, lng: 32.400713 },
    { lat: 29.426903, lng: 32.400563 },
    { lat: 29.427231, lng: 32.400291 },
    { lat: 29.427293, lng: 32.400004 },
  ];

  const parkingLot2 = [
    { lat: 29.426952, lng: 32.404717 },
    { lat: 29.426972, lng: 32.404686 },
    { lat: 29.426954, lng: 32.404661 },
    { lat: 29.426995, lng: 32.404618 },
    { lat: 29.427023, lng: 32.404631 },
    { lat: 29.427043, lng: 32.404601 },
    { lat: 29.42738, lng: 32.404902 },
    { lat: 29.42736, lng: 32.404945 },
    { lat: 29.427431, lng: 32.405018 },
    { lat: 29.427463, lng: 32.404991 },
    { lat: 29.427579, lng: 32.405101 },
    { lat: 29.427493, lng: 32.40523 },
    { lat: 29.427162, lng: 32.404913 },
    { lat: 29.427181, lng: 32.404876 },
    { lat: 29.427162, lng: 32.404858 },
    { lat: 29.427103, lng: 32.40494 },
    { lat: 29.427103, lng: 32.40494 },
    { lat: 29.427103, lng: 32.40494 },
    { lat: 29.427103, lng: 32.40494 },
    { lat: 29.427103, lng: 32.40494 },
  ];

  const parkingLot3 = [
    { lat: 29.429294, lng: 32.403985 },
    { lat: 29.429569, lng: 32.403586 },
    { lat: 29.429549, lng: 32.403554 },
    { lat: 29.429567, lng: 32.403514 },
    { lat: 29.42953, lng: 32.40348 },
    { lat: 29.429507, lng: 32.403504 },
    { lat: 29.429468, lng: 32.403483 },
    { lat: 29.42936, lng: 32.403644 },
    { lat: 29.429376, lng: 32.403672 },
    { lat: 29.429346, lng: 32.403721 },
    { lat: 29.429298, lng: 32.403686 },
    { lat: 29.429267, lng: 32.403733 },
    { lat: 29.429306, lng: 32.403776 },
    { lat: 29.429288, lng: 32.403802 },
    { lat: 29.429253, lng: 32.403779 },
    { lat: 29.429104, lng: 32.403981 },
    { lat: 29.429252, lng: 32.404131 },
    { lat: 29.429301, lng: 32.404064 },
    { lat: 29.429236, lng: 32.404006 },
    { lat: 29.429258, lng: 32.403969 },
  ];

  const parkingLot4 = [
    { lat: 29.431207, lng: 32.401462 },
    { lat: 29.430989, lng: 32.40123 },
    { lat: 29.431011, lng: 32.401197 },
    { lat: 29.430982, lng: 32.40116 },
    { lat: 29.431169, lng: 32.400929 },
    { lat: 29.431285, lng: 32.401045 },
    { lat: 29.431318, lng: 32.401012 },
    { lat: 29.431294, lng: 32.400971 },
    { lat: 29.43137, lng: 32.400854 },
    { lat: 29.431403, lng: 32.400876 },
    { lat: 29.431424, lng: 32.400856 },
    { lat: 29.431467, lng: 32.400897 },
    { lat: 29.431453, lng: 32.400926 },
    { lat: 29.431477, lng: 32.400963 },
    { lat: 29.431251, lng: 32.40132 },
    { lat: 29.431219, lng: 32.401299 },
    { lat: 29.431197, lng: 32.401324 },
    { lat: 29.431255, lng: 32.401386 },
    { lat: 29.431203, lng: 32.401462 },
  ];

  const parkingLot5 = [
    { lat: 29.433098, lng: 32.399042 },
    { lat: 29.433036, lng: 32.398969 },
    { lat: 29.433014, lng: 32.398998 },
    { lat: 29.433034, lng: 32.399033 },
    { lat: 29.432925, lng: 32.399165 },
    { lat: 29.432893, lng: 32.399146 },
    { lat: 29.432878, lng: 32.399163 },
    { lat: 29.432845, lng: 32.399125 },
    { lat: 29.432855, lng: 32.399095 },
    { lat: 29.432831, lng: 32.39906 },
    { lat: 29.433144, lng: 32.398703 },
    { lat: 29.433223, lng: 32.398786 },
    { lat: 29.433125, lng: 32.398921 },
    { lat: 29.433088, lng: 32.398894 },
    { lat: 29.433068, lng: 32.398922 },
    { lat: 29.43313, lng: 32.398986 },
  ];

  const parkingLot6 = [
    { lat: 29.430983, lng: 32.3981544 },
    { lat: 29.431111, lng: 32.398284 },
    { lat: 29.431407, lng: 32.397898 },
    { lat: 29.431386, lng: 32.397869 },
    { lat: 29.431429, lng: 32.397791 },
    { lat: 29.431404, lng: 32.39776 },
    { lat: 29.43107, lng: 32.398154 },
    { lat: 29.431011, lng: 32.398101 },
  ];
  const parkingLot7 = [
    { lat: 29.430334, lng: 32.399376 },
    { lat: 29.430402, lng: 32.399376 },
    { lat: 29.430392, lng: 32.399698 },
    { lat: 29.430435, lng: 32.399721 },
    { lat: 29.430438, lng: 32.399768 },
    { lat: 29.430486, lng: 32.399768 },
    { lat: 29.430542, lng: 32.399721 },
    { lat: 29.43054, lng: 32.399127 },
    { lat: 29.430441, lng: 32.399086 },
    { lat: 29.430428, lng: 32.399271 },
    { lat: 29.430318, lng: 32.3993 },
  ];
  const parkingLot8 = [
    { lat: 29.428022, lng: 32.402006 },
    { lat: 29.428113, lng: 32.402109 },
    { lat: 29.428044, lng: 32.402109 },
    { lat: 29.427744, lng: 32.40258 },
    { lat: 29.427777, lng: 32.402618 },
    { lat: 29.427744, lng: 32.402676 },
    { lat: 29.427861, lng: 32.402787 },
    { lat: 29.427978, lng: 32.402784 },
    { lat: 29.428039, lng: 32.402694 },
    { lat: 29.428027, lng: 32.402626 },
    { lat: 29.42834, lng: 32.402872 },
    { lat: 29.428539, lng: 32.402568 },
    { lat: 29.428521, lng: 32.402509 },
    { lat: 29.428572, lng: 32.402527 },
    { lat: 29.428602, lng: 32.40248 },
    { lat: 29.428101, lng: 32.402012 },
  ];

  // Create the polygons and set them on the map
  const parkingLots = [
    parkingLot1,
    parkingLot2,
    parkingLot3,
    parkingLot4,
    parkingLot5,
    parkingLot6,
    parkingLot7,
    parkingLot8,
  ];

  parkingLots.forEach((lot) => {
    const polygon = new google.maps.Polygon({
      paths: lot,
      strokeColor: "#00FF00",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#00FF00",
      fillOpacity: 0.35,
    });
    polygon.setMap(map);
  });

  const redAreaCoordinates = [
    { lat: 29.424617406683318, lng: 32.39990266216866 },
    { lat: 29.427364754309696, lng: 32.39994557751128 },
    { lat: 29.42801887374435, lng: 32.39872249024658 },
    { lat: 29.428579544192505, lng: 32.39827187914905 },
    { lat: 29.429121522683744, lng: 32.398014387093326 },
    { lat: 29.430280225618688, lng: 32.39779981038022 },
    { lat: 29.431302550313013, lng: 32.39540058440305 },
    { lat: 29.43025776377204, lng: 32.39492074672488 },
    { lat: 29.429277816282433, lng: 32.394788377710206 },
    { lat: 29.42838432650709, lng: 32.39487110834438 },
    { lat: 29.42794486029904, lng: 32.394977321041836 },
    { lat: 29.42706650954878, lng: 32.39535189369641 },
    { lat: 29.426388919481887, lng: 32.395851323913725 },
    { lat: 29.426076033342195, lng: 32.396125637942475 },
    { lat: 29.42548421131751, lng: 32.39685639919856 },
    { lat: 29.425093383578417, lng: 32.397606390985786 },
    { lat: 29.424808636707333, lng: 32.39836920314543 },
    { lat: 29.424646721457204, lng: 32.398965350465176 },
    { lat: 29.424579721970634, lng: 32.39939483294162 },
    { lat: 29.42454622221076, lng: 32.39988200709399 },
    // 29.43301878738705,
    // 32.39725847256929,
  ];

  const redAreaPolygon = new google.maps.Polygon({
    paths: redAreaCoordinates,
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
  });

  redAreaPolygon.setMap(map);

  // Add scooter markers

  let scooters = [
    {
      id: "s1",
      number: "S1",
      lat: 29.428219223091464,
      lng: 32.40387109222776,
      lockStatus: "locked",
    },
    // {

    //   number: "S2",
    //   lat: 29.42892940373553,
    //   lng: 32.40246561475691,
    //   lockStatus: "locked",
    // },
    // {

    //   number: "S3",
    //   lat: 31.240078493874645,
    //   lng: 32.31710126613344,
    //   lockStatus: "locked",
    // },
    // {

    //   number: "S4",
    //   lat: 29.431064909710784,
    //   lng: 32.40074072505988,
    //   lockStatus: "locked",
    // },
    // {
    //   id:
    //   number: "S5",
    //   lat: 29.43146350009885,
    //   lng: 32.398714443512276,
    //   lockStatus: "locked",
    // },
    // // {
    // //   id: 6,
    // //   number: "S5",
    // //   lat: 29.426679,
    // //   lng: 32.40053,
    // //   lockStatus: "locked",
    // // },
  ];

  // scooterPositions.forEach((position, index) => {
  //   const scooterMarker = new google.maps.Marker({
  //     position: position,
  //     map: map,
  //     icon: {
  //       url: "imgs/Liner scoot scooter.png",
  //       scaledSize: new google.maps.Size(50, 50),
  //     },
  //     title: "Scooter Available",
  //   });
  //   // Add click listener for scooter markers
  //   scooterMarker.addListener("click", () => {
  //     // Check if the same marker is clicked again
  //     if (lastClickedMarker === scooterMarker) {
  //       // Hide the details and remove the line
  //       hideScooterDetails();
  //       removeLastPolyline();
  //       lastClickedMarker = null;
  //     } else {
  //       // New marker clicked
  //       // Remove the previous line and details
  //       removeLastPolyline();
  //       hideScooterDetails();
  //       if (userLocation) {
  //         const distance = calculateDistance(userLocation, position);
  //         const walkingSpeed = 5; // km/h
  //         const timeToReach = (distance / walkingSpeed) * 60; // minutes

  //         lastPolyline = drawLineToScooter(userLocation, position);
  //         displayScooterDetailsWithDistance(index, distance, timeToReach);
  //       } else {
  //         alert("User location not available.");
  //       }
  //       lastClickedMarker = scooterMarker; // Update the last clicked
  //     }
  //   });
  //   scooterMarkers.push(scooterMarker);
  // });
  const scooterPositions = scooters.map((scooter) => ({
    lat: scooter.lat,
    lng: scooter.lng,
  }));
  // Function to add a new scooter position
  function addScooterPosition(scooterData) {
    const position = {
      lat: parseFloat(scooterData.lat),
      lng: parseFloat(scooterData.lng),
    };
    scooterPositions.push(position);
    scooters.push(scooterData);

    const scooterMarker = new google.maps.Marker({
      position: position,
      map: map,
      icon: {
        url: "imgs/Liner scoot scooter.png",
        scaledSize: new google.maps.Size(50, 50),
      },
      title: "Scooter Available",
    });

    scooterMarker.addListener("click", () => {
      if (lastClickedMarker === scooterMarker) {
        hideScooterDetails();
        removeLastPolyline();
        lastClickedMarker = null;
      } else {
        removeLastPolyline();
        hideScooterDetails();
        if (userLocation) {
          const distance = calculateDistance(userLocation, position);
          const walkingSpeed = 5; // km/h
          const timeToReach = (distance / walkingSpeed) * 60; // minutes

          lastPolyline = drawLineToScooter(userLocation, position);
          displayScooterDetailsWithDistance(scooterData, distance, timeToReach);
        } else {
          alert("User location not available.");
        }
        lastClickedMarker = scooterMarker;
      }
    });

    scooterMarkers.push(scooterMarker);
  }

  // Initial markers
  scooterPositions.forEach((position, index) => {
    const scooterMarker = new google.maps.Marker({
      position: position,
      map: map,
      icon: {
        url: "imgs/Liner scoot scooter.png",
        scaledSize: new google.maps.Size(50, 50),
      },
      title: "Scooter Available",
    });

    scooterMarker.addListener("click", () => {
      if (lastClickedMarker === scooterMarker) {
        hideScooterDetails();
        removeLastPolyline();
        lastClickedMarker = null;
      } else {
        removeLastPolyline();
        hideScooterDetails();
        if (userLocation) {
          const distance = calculateDistance(userLocation, position);
          const walkingSpeed = 5; // km/h
          const timeToReach = (distance / walkingSpeed) * 60; // minutes

          lastPolyline = drawLineToScooter(userLocation, position);
          displayScooterDetailsWithDistance(
            scooters[index],
            distance,
            timeToReach
          );
        } else {
          alert("User location not available.");
        }
        lastClickedMarker = scooterMarker;
      }
    });

    scooterMarkers.push(scooterMarker);
  });

  const newScooterData = localStorage.getItem("newScooter");
  if (newScooterData) {
    const scooterData = JSON.parse(newScooterData);
    // scooterData.id = scooters.length + 1; // Assign a new ID
    addScooterPosition(scooterData);
    localStorage.removeItem("newScooter"); // Clear the data from local storage
  }

  // // Example functions to calculate distance and time
  // function calculateDistance(location1, location2) {
  //   // Implement your distance calculation logic here
  //   return 1.5; // Example distance in km
  // }

  // // Function to calculate distance
  // function calculateDistance(start, end) {
  //   const R = 6371; // Radius of the Earth in km
  //   const dLat = (end.lat - start.lat) * (Math.PI / 180);
  //   const dLng = (end.lng - start.lng) * (Math.PI / 180);
  //   const a =
  //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.cos(start.lat * (Math.PI / 180)) *
  //       Math.cos(end.lat * (Math.PI / 180)) *
  //       Math.sin(dLng / 2) *
  //       Math.sin(dLng / 2);
  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   const distance = R * c; // Distance in km
  //   return distance;
  // }

  // function calculateTimeToReach(distance) {
  //   // Implement your time calculation logic here
  //   return distance / 0.05; // Example time in minutes (assuming 3 km/h speed)
  // }

  // Function to calculate time to reach
  function calculateTimeToReach(distance) {
    const walkingSpeed = 5; // km/h
    return (distance / walkingSpeed) * 60; // minutes
  }

  // Add parking spot markers
  const parkingPositions = [
    { lat: 29.43131900771689, lng: 32.39797480726594 },
    // { lat: 29.426679, lng: 32.40053 },
    { lat: 29.427212, lng: 32.404924 },
    { lat: 29.428057, lng: 32.402258 },
    { lat: 29.42951, lng: 32.403605 },
    // { lat: 29.432473, lng: 32.399646 },
    // { lat: 29.431632, lng: 32.397559 },
    { lat: 29.430431, lng: 32.39949 },
    // { lat: 29.432692, lng: 32.397133 },
    { lat: 29.43128630291147, lng: 32.401096898520706 },
    { lat: 29.433037348262644, lng: 32.39890488040191 },
    { lat: 29.42682743876561, lng: 32.40027280699874 },
  ];

  parkingPositions.forEach((position) => {
    new google.maps.Marker({
      position: position,
      map: map,
      icon: {
        url: "imgs/Liner scoot park.png",
        scaledSize: new google.maps.Size(80, 50),
      },
      title: "Parking Spot",
    });
  });

  //dot
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Set the center to user's current location
        map.setCenter(userLocation);

        if (marker) {
          marker.setPosition(userLocation);
          if (directionMarker) {
            updateDirectionMarker(position.coords.heading, userLocation);
          }
        } else {
          // Create a custom marker (circle) to indicate the user's location
          marker = new google.maps.Marker({
            position: userLocation,
            map,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 15,
              fillColor: "#FF8800",
              fillOpacity: 1,
              strokeWeight: 4,
              strokeColor: "#FFff",
            },
          });
          for (let i = 0; i < 1; i++) {
            const lightCone = new google.maps.Polygon({
              map: map,
              paths: createConePath(userLocation, 0, i), // Initial cone path
              strokeColor: "transparent",

              fillColor: "#FF8800",
              fillOpacity: 0.1, // Make it semi-transparent
            });
            lightConeLayers.push(lightCone);
          }
        }
      },
      () => {
        // Handle location error
        handleLocationError(true, map.getCenter(), map);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000,
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, map.getCenter(), map);
  }

  document.getElementById("go-to-location").addEventListener("click", () => {
    goToMyLocation();
  });

  function goToMyLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Set the center to user's current location
          map.setCenter(userLocation);

          marker.setPosition(userLocation);
        },
        () => {
          alert("Error in location");
        }
      );
    }
  }
  function calculateDistance(start, end) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (end.lat - start.lat) * (Math.PI / 180);
    const dLng = (end.lng - start.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(start.lat * (Math.PI / 180)) *
        Math.cos(end.lat * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  function drawLineToScooter(start, end) {
    const Polyline = new google.maps.Polyline({
      path: [start, end],
      geodesic: true,
      strokeColor: "#FF8800",
      strokeOpacity: 0.7,
      strokeWeight: 5,
      map: map,
    });
    return Polyline;
  }

  function hideScooterDetails() {
    const scooterDetails = document.getElementById("scooterClick");
    scooterDetails.style.display = "none";
  }

  function removeLastPolyline() {
    if (lastPolyline) {
      lastPolyline.setMap(null);
      lastPolyline = null;
    }
  }
  // function displayScooterDetailsWithDistance(
  //   scooterData,
  //   distance,
  //   timeToReach
  // ) {
  //   const scooterDetails = document.getElementById("scooterClick");
  //   scooterDetails.style.display = "block";
  //   document.querySelector(".scooter-id").innerText =
  //     "SCOOT ID: " + scooterData.id;
  //   document.querySelector(".status").innerText =
  //     scooterData.lockStatus.toUpperCase();
  //   document.querySelector(".battery-bar").style.width = "80%";
  //   document.querySelector(".distance").innerText =
  //     "Distance: " + distance.toFixed(2) + " km";
  //   document.querySelector(".time").innerText =
  //     "Time: " + timeToReach.toFixed(0) + " min";
  // }

  function displayScooterDetailsWithDistance(
    scooterData,
    distance,
    timeToReach
  ) {
    const scooterDetailsContainer = document.getElementById("scooterClick");
    scooterDetailsContainer.style.display = "block";

    const scooterDetailsHTML = `
        <div class="scooter-id">SCOOT ID: ${scooterData.id}</div>
        <img src="${scooterData.photo}" alt="Scooter" class="scooter-image">
        <div class="scooter-status">
            <span class="status">${scooterData.lockStatus.toUpperCase()}</span>
            <div class="time">Time: ${timeToReach.toFixed(0)} min</div>
            <div class="distance">Distance: ${distance.toFixed(2)} km</div>
        </div>
    `;

    scooterDetailsContainer.innerHTML = scooterDetailsHTML;
  }

  function updateLightCone(heading, pos) {
    // Update each light cone layer based on heading
    lightConeLayers.forEach((lightCone, index) => {
      lightCone.setPath(createConePath(pos, heading, index));
    });
  }

  function createConePath(center, heading, layer) {
    // Calculate the light cone points based on heading
    const coneLength = 0.0002 - layer * 0.0001; // Adjust this value to make the light cone longer or shorter
    const coneWidth = 0.52 - layer * 0.00004; // Adjust this value to make the light cone wider or narrower

    // Convert heading from degrees to radians
    const headingRad = (heading * Math.PI) / 180;

    // Calculate the positions of the two outer points of the cone
    const point1 = {
      lat: center.lat + coneLength * Math.cos(headingRad - coneWidth),
      lng: center.lng + coneLength * Math.sin(headingRad - coneWidth),
    };

    const point2 = {
      lat: center.lat + coneLength * Math.cos(headingRad + coneWidth),
      lng: center.lng + coneLength * Math.sin(headingRad + coneWidth),
    };

    return [center, point1, point2, center];
  }

  function handleLocationError(browserHasGeolocation, pos, map) {
    alert(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
  }
}
window.initMap = initMap;

// Load the Google Maps API asynchronously and then call initMap
function loadGoogleMapsScript() {
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD26fVBtlyRntHRuVcbP_QBjg8rCCuAqj0&callback=initMap`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

document.addEventListener("DOMContentLoaded", loadGoogleMapsScript);

//map style
// function initMap() {
//   // Create a new StyledMapType object, passing it an array of styles,
//   // and the name to be displayed on the map type control.
//   const styledMapType = new google.maps.StyledMapType(
//     [
//       // {
//       //   featureType: "all",
//       //   elementType: "labels.text.fill",
//       //   stylers: [{ color: "#523735" }],
//       // },
//       {
//         featureType: "all",
//         elementType: "labels.text.stroke",
//         stylers: [{ color: "#f5f1e6" }],
//       },
//       {
//         featureType: "road.local",
//         elementType: "geometry",
//         stylers: [{ color: "#9e9e9e" }], // Gray color for roads
//       },
//       {
//         featureType: "road.local",
//         elementType: "geometry.stroke",
//         stylers: [{ color: "#7b7b7b" }], // Darker gray stroke for roads
//       },
//       // {
//       //   featureType: "landscape.man_made",
//       //   elementType: "geometry",
//       //   stylers: [{ color: "#b86b4d" }], // Brown color for buildings
//       // },
//       {
//         featureType: "landscape.man_made",
//         elementType: "geometry.stroke",
//         stylers: [{ color: "#8c4a2f" }], // Darker brown stroke for buildings
//       },
//     ],
//     { name: "Styled Map" }
//   );
// }

document.getElementById("scanQRButton").addEventListener("click", function () {
  // Show the terms and conditions modal
  document.getElementById("termsModal").style.display = "flex";
});

document.getElementById("agreeButton").addEventListener("click", function () {
  // Hide the modal after the user agrees
  document.getElementById("termsModal").style.display = "none";

  // Hide the scan QR button after it's clicked
  document.getElementById("scanCont").style.display = "none";

  const scanner = new Html5QrcodeScanner("reader", {
    qrbox: { width: 250, height: 250 },
    fps: 20,
  });

  scanner.render(onScanSuccess, onScanError);

  function onScanSuccess(decodedText) {
    displayScooterDetails(decodedText);
    // Hide the reader after a successful scan
    document.getElementById("reader").style.display = "none";
    document.getElementById("manualCodeEntry").style.display = "none";
  }

  function onScanError(err) {
    //  console.error(err);
    // Show the manual code entry if an error occurs

    document.getElementById("manualCodeEntry").style.display = "block";
    
  }
  // document.addEventListener("DOMContentLoaded", function () {
  //   document
  //     .getElementById("submitCodeButton")
  //     .addEventListener("click", function () {
  //       const scooterCode = document.getElementById("manualCode").value;
  //       const currentBalance =
  //         document.getElementById("currentBalance").textContent;
  //       localStorage.setItem("scooterCode", scooterCode);
  //       localStorage.setItem("currentBalance", currentBalance);
  //       window.location.href = "MyScooter.html";
  //     });
  // //
  //   document
  //     .getElementById("scanQRButton")
  //     .addEventListener("click", function () {
  //       const html5QrCode = new Html5Qrcode("reader");
  //       html5QrCode
  //         .start(
  //           { facingMode: "environment" }, // Use rear camera
  //           {
  //             fps: 10, // Scans per second
  //             qrbox: { width: 250, height: 250 }, // QR code scanning box
  //           },
  //           (qrCodeMessage) => {
  //             // Handle the scanned code
  //             const scooterCode = qrCodeMessage;
  //             const currentBalance =
  //               document.getElementById("currentBalance").textContent;
  //             localStorage.setItem("scooterCode", scooterCode);
  //             localStorage.setItem("currentBalance", currentBalance);
  //             window.location.href = "MyScooter.html";
  //           },
  //           (errorMessage) => {
  //             // Handle scan error
  //             console.log(`QR Code no longer in front of camera.`);
  //           }
  //         )
  //         .catch((err) => {
  //           // Start failed, handle it
  //           console.error(`Unable to start scanning, error: ${err}`);
  //         });
  //     });
  // });
  //

  const requestCameraButton = document.querySelector(".html5-qrcode-element ");

  document
    .querySelector(".html5-qrcode-element ")
    .addEventListener("click", function () {
      // Hide the scan QR button after it's clicked
      document.getElementById("manualCodeEntry").style.display = "block";
    });

  if (requestCameraButton) {
    requestCameraButton.addEventListener("click", function () {
      const errorElement = document.getElementById("reader__header_message");

      if (errorElement && errorElement.innerText.includes("NotFoundError")) {
        // Show the "Enter Scooter ID" input if there's a NotFoundError
        document.getElementById("manualCodeEntry").style.display = "block";
      }
    });
  } else {
    console.error("Request Camera Permissions button not found.");
  }
});

document
  .getElementById("submitCodeButton")
  .addEventListener("click", function () {
    let manualCode = document.getElementById("manualCode").value;

    if (manualCode) {
      displayScooterDetails(manualCode);
      // Hide the reader after submitting the scooter ID manually
      document.getElementById("reader").style.display = "none";
      document.getElementById("manualCodeEntry").style.display = "none";
    } else {
      document.getElementById("manualCodeEntry").style.display = "block";
    }
  });

// function displayScooterDetails(code) {
//   document.getElementById("scooterDetails").style.display = "block";
//   document.querySelector(".scooter-id").innerText = "SCOOT ID: " + code;
//   document.querySelector(".status").innerText = "LOCKED";
//   document.querySelector(".battery-bar").style.width = "80%";
// }

function displayScooterDetails(scooterCode, currentBalance) {
  document.querySelector(".scooter-id").innerText = "SCOOT ID: " + scooterCode;
  document.getElementById("scooter-image").src =
    "imgs/Good-Quality-Yellow-Black-Electric-Scooter-for-Sale.jpg";
  document.getElementById("scooterDetails").style.display = "block";
  document.getElementById("newScooterDetails").style.display = "none";

  document
    .getElementById("startRideButton")
    .addEventListener("click", function () {
      document.getElementById("newScooterId").textContent = scooterCode;
      document.getElementById("newScooterDetails").style.display = "block";
      document.getElementById("scooterDetails").style.display = "none";
    });
}

// Sidebar and Menu toggle
document.getElementById("menuButton").addEventListener("click", function () {
  document.getElementById("sidebar").classList.toggle("open");
});

document.getElementById("upload-button").addEventListener("click", function () {
  // Request access to photos and open file input
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.click();

  fileInput.onchange = function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("profilePic").src = e.target.result;
        // Here, you could also add a confirmation dialog to set it as the profile picture
      };
      reader.readAsDataURL(file);
    }
  };
});

//hide scooter
document.addEventListener("DOMContentLoaded", function () {
  const scooterDetails = document.getElementById("scooterDetails");
  const scooterId = document.querySelector(".scooter-id");
  let isDetailsFullyVisible = false; // Flag to track if the details are fully shown

  // Function to hide the scooter details except for the scooter ID
  function hideScooterDetails() {
    if (isDetailsFullyVisible) {
      // Only hide if the details have been fully shown
      scooterDetails.classList.add("collapsed");
      isDetailsFullyVisible = false; // Update flag when details are hidden
    }
  }

  // Function to show the full scooter details
  function showScooterDetails() {
    scooterDetails.classList.remove("collapsed");
    isDetailsFullyVisible = true; // Update flag when details are fully shown
  }

  // Add event listener to the document to detect clicks outside the container
  document.addEventListener("click", function (event) {
    // If the details are fully visible and the click is outside the scooter details container, hide it
    if (isDetailsFullyVisible && !scooterDetails.contains(event.target)) {
      hideScooterDetails();
    }
  });

  // Add event listener to the scooter ID to show the full container when clicked
  scooterId.addEventListener("click", function (event) {
    event.stopPropagation(); // Prevent the click from propagating to the document

    // If the details are not fully visible, show them
    if (!isDetailsFullyVisible) {
      showScooterDetails();
    }
  });
});

document.querySelectorAll(".dropdown-toggle").forEach((item) => {
  item.addEventListener("click", function (e) {
    e.preventDefault();
    const parentLi = this.parentElement;

    // Close any other open dropdown
    document.querySelectorAll(".dropdown").forEach((li) => {
      if (li !== parentLi) {
        li.classList.remove("open");
      }
    });

    // Toggle the open class on the clicked dropdown
    parentLi.classList.toggle("open");
  });
});
document.querySelectorAll(".dropdown-toggle").forEach((item) => {
  item.addEventListener("click", function (e) {
    e.preventDefault();
    const menu = this.nextElementSibling;

    if (menu.style.display === "block") {
      menu.style.opacity = "0";
      menu.style.visibility = "hidden";
      setTimeout(() => {
        menu.style.display = "none";
      }, 300);
    } else {
      menu.style.display = "block";
      setTimeout(() => {
        menu.style.opacity = "1";
        menu.style.visibility = "visible";
      }, 10);
    }
  });
});

function logout() {
  localStorage.removeItem("userData"); 
  window.location.href = "/login.html"; 
}