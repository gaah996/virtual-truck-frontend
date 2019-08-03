<template>
  <div class="container">
    <Header>
      <div class="search-box">
        <form @submit.prevent="positionMap()">
          <input type="text" v-model="query" placeholder="Pesquise por um endereço ou local" />
          <img src="@/assets/img/icons/search.png" alt="Search" />
        </form>
      </div>
    </Header>
    <div class="content">
      <div class="lateral-menu">
        <h1>Criar novo frete</h1>
        <div class="address-card" v-if="points.start.address != null">
          <div class="card-title">
            <img src="@/assets/img/icons/menu.png" alt="menu" />
            <h2>Endereço de retirada</h2>
          </div>
          <div class="card-content">
            <img src="@/assets/img/icons/marker.png" alt="marker" />
            <p>{{points.start.address}}</p>
          </div>
        </div>
        <div class="address-card" v-if="points.end.address != null">
          <div class="card-title">
            <img src="@/assets/img/icons/menu.png" alt="menu" />
            <h2>Endereço de entrega</h2>
          </div>
          <div class="card-content">
            <img src="@/assets/img/icons/marker.png" alt="marker" />
            <p>{{points.end.address}}</p>
          </div>
        </div>
        <div class="info-card">
          <div class="card-title">
            <img src="@/assets/img/icons/menu.png" alt="menu" />
            <h2>Informações da carga</h2>
          </div>
          <div class="card-content">
            <span class="input">
              <h4>Preço:</h4>
              <p v-if="this.price != null">{{price | toCurrency}}</p>
              <p v-else>
                <small>Selecione no mapa para calcular o preço</small>
              </p>
            </span>
            <span class="input">
              <h4>Distância:</h4>
              <p v-if="this.price != null">{{route.distance.text}}</p>
            </span>
            <span class="input">
              <h4>Tempo:</h4>
              <p v-if="this.price != null">{{route.time.text}}</p>
            </span>
            <textarea rows="4" placeholder="Descrição" v-model="description"></textarea>
            <div class="text">
              <img src="@/assets/img/icons/qualification.svg" alt="qualification" />
              <h3>Qualificações</h3>
            </div>
            <span v-for="qualification in qualifications" :key="qualification.name">
              <input
                type="checkbox"
                :value="qualification.id"
                v-model="selectedQualifications"
                name="qualification"
              />
              {{qualification.name}}
            </span>
          </div>
        </div>

        <span>
          <button @click="calcRoute()" v-if="points.start.fixed && points.end.fixed">Calcular rota</button>
          <button @click="saveFreight()" v-if="points.start.fixed && points.end.fixed">Confirmar</button>
        </span>
        <div class="white-space"></div>
      </div>
      <div id="map" class="map"></div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header/Header.vue";
import api from "@/services/api";
import user from "@/services/user";
import Pusher from "pusher-js";

export default {
  name: "map",
  components: { Header },
  data: () => ({
    map: null,
    points: {
      start: {
        marker: null,
        address: null,
        infowindow: null,
        fixed: false
      },
      end: {
        marker: null,
        address: null,
        infowindow: null,
        fixed: false
      }
    },
    route: {
      direction: null,
      time: null,
      distance: null
    },
    query: null,
    price: null,
    description: null,
    qualifications: null,
    selectedQualifications: []
  }),
  created() {
    this.getQualifications();
    if (user.data.type == 2) {
      Pusher.logToConsole = true;
      let pusher = new Pusher("b8c034b01668674831fd", { cluster: "mt1" });
      pusher.subscribe("Send");
      pusher.bind("Send", data => {
        this.points.start.marker = new google.maps.Marker({
          position: {
            lat: parseFloat(data.freight.origin.split(",")[0]),
            lng: parseFloat(data.freight.origin.split(",")[1])
          },
          map: this.map
        });

        const content = `
            <p>Novo frete disponível!</p>
            <p>Valor: ${this.$options.filters.toCurrency(
              parseFloat(data.freight.price)
            )}</p>
            <p>Distância: ${data.freight.distance}</p>
            <p>Tempo estimado: ${data.freight.time}</p>
            <p>Descrição: ${data.freight.type.description}</p>
            `;

        this.points.start.infowindow = new google.maps.InfoWindow({
          content
        });

        this.points.start.infowindow.open(this.map, this.points.start.marker);
      });
    }
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      if (this.map == null) {
        this.map = new google.maps.Map(document.querySelector("#map"), {
          center: { lat: -23.513204, lng: -46.5717937 },
          zoom: 14,
          clickableIcons: false,
          streetViewControl: false
        });

        //Watch for a click to add a marker
        google.maps.event.addListener(this.map, "click", event => {
          if (!this.points.start.fixed) {
            if (this.points.start.marker != null) {
              //Removes the marker
              this.points.start.marker.setMap(null);
            }

            this.points.start.marker = new google.maps.Marker({
              position: event.latLng,
              map: this.map
            });

            this.points.start.fixed = true;

            const content = `
            <p>Retirar carga aqui!</p>
            `;

            this.points.start.infowindow = new google.maps.InfoWindow({
              content
            });

            this.points.start.infowindow.open(
              this.map,
              this.points.start.marker
            );

            //Set address
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode(
              { location: this.points.start.marker.getPosition() },
              (results, status) => {
                if (status == google.maps.GeocoderStatus.OK) {
                  this.points.start.address = results[0].formatted_address;
                }
              }
            );

            google.maps.event.addListenerOnce(
              this.points.start.infowindow,
              "closeclick",
              () => {
                this.points.start.fixed = false;
                this.points.start.address = null;
                this.points.start.infowindow.close();
              }
            );
          } else if (!this.points.end.fixed) {
            if (this.points.end.marker != null) {
              //Removes the marker
              this.points.end.marker.setMap(null);
            }
            this.points.end.marker = new google.maps.Marker({
              position: event.latLng,
              map: this.map
            });

            this.points.end.fixed = true;

            const content = `
            <p>Entregar carga aqui!</p>
            `;

            this.points.end.infowindow = new google.maps.InfoWindow({
              content
            });

            this.points.end.infowindow.open(this.map, this.points.end.marker);

            //Set address
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode(
              { location: this.points.end.marker.getPosition() },
              (results, status) => {
                if (status == google.maps.GeocoderStatus.OK) {
                  this.points.end.address = results[0].formatted_address;
                }
              }
            );

            google.maps.event.addListenerOnce(
              this.points.end.infowindow,
              "closeclick",
              () => {
                this.points.end.fixed = false;
                this.points.end.address = null;
                this.points.end.infowindow.close();
              }
            );
          }
        });
      }
    },
    positionMap() {
      if (this.query != null) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: this.query }, (results, status) => {
          if (status == google.maps.GeocoderStatus.OK) {
            const center = results[0].geometry.location;

            this.map.setCenter(center);
            this.map.setZoom(14);
          } else {
            alert("Não foi possível encontrar o endereço informado.");
          }
        });
      }
    },
    calcRoute() {
      this.points.start.infowindow.close();
      this.points.end.infowindow.close();
      this.route.direction = new google.maps.DirectionsService();

      this.route.direction.route(
        {
          origin: this.points.start.marker.getPosition(),
          destination: this.points.end.marker.getPosition(),
          travelMode: "DRIVING"
        },
        (results, status) => {
          console.log(results);
          if (status == google.maps.DirectionsStatus.OK) {
            const renderer = new google.maps.DirectionsRenderer();

            renderer.setOptions({
              suppressMarkers: true
            });
            renderer.setDirections(results);
            renderer.setMap(this.map);

            //Time, distance and price info
            this.route.time = results.routes[0].legs[0].duration;
            this.route.distance = results.routes[0].legs[0].distance;
            this.price = (this.route.distance.value / 1000) * 4.57 * 10;
          } else {
            alert("Não foi possível encontrar uma rota");
          }
        }
      );
    },
    async saveFreight() {
      const params = {
        origin:
          this.points.start.marker.getPosition().lat() +
          "," +
          this.points.start.marker.getPosition().lng(),
        destin:
          this.points.end.marker.getPosition().lat() +
          "," +
          this.points.end.marker.getPosition().lng(),
        price: this.price,
        distance: this.route.distance.text,
        time: this.route.time.text,
        type: {
          description: this.description
          // qualifications: this.selectedQualifications
        }
      };

      try {
        const { data } = await api.post("/freight/new", params, {
          headers: {
            Authorization: "Bearer " + user.data.token
          }
        });
      } catch (error) {
        alert("Erro ao salvar o frete");
      }
    },
    async getQualifications() {
      try {
        const { data } = await api.get("/qualification/show", {
          headers: {
            Authorization: "Bearer " + user.data.token
          }
        });

        this.qualifications = data.qualifications;
      } catch (error) {
        alert("Não foi possível obter as qualificações");
      }
    }
  }
};
</script>

<style src="./style.scss" lang="scss" scoped>
</style>
