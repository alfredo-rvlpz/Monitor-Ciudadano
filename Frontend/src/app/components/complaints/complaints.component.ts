import { UserService } from './../../services/user.service';
import { User } from './../../models/user';
import { CategoryService } from './../../services/category.service';
import { Complaint } from './../../models/complaint';
import { ComplaintService } from './../../services/complaint.service';
import { Map } from './../../models/map';
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.css'],
  providers: [ComplaintService,CategoryService]
})


export class ComplaintsComponent implements OnInit {
  address: string; //variable que guarda la direccion otorgada por la libreria places, funcion pero no se muestra en pantalla debido a que no se usa
  newMarker = false; // Este booleano indica si el estado es que esta viendo todas las quejas o esta registrando una nueva
  private geoCoder; // Estas es una variable donde se guarda el goecoder de google
  selectedFile: File; // Variable donde se guardaria la imagen de la queja pero que por tiempos no se implemento
  complaints: Array<Complaint>; // Un arreglo con las quejas que se mostraran como marcadores
  categories: Array<Category>; // Un arreglo con las categorias de quejas que hay en la base de datos
  newComplaint: Complaint; // El modelo que guarda los valores de la nueva queja que se esta registrando
  user: User; // Aqui se encuentra la informacion del usuario recuperada en app.component
  map: Map; // Este es modelo que esta ligado al mapa en la vista
  previous; // Esta viariable guarda la informacion de la ventana de marcador abierta para cerrarla al momento de abrir otra
  message='defaul message'; // Guarda el mensaje que se muestra en el modal
  filter=0; // Indica que el valor de la categoria por la que se va a filtrar, este valor tambien corresponde al id de la categoria en la bd.
  onlyUser=false; // Indica si el usuario solo quiere ver sus quejas.
  updaterzoom = .01; //Esta variable se utiliza para cambiar el zoom de manera imperceptible para que se resetee el zoom ya que si no hay cambio no lo hace correctamente

//Obtiene el component con la etiqueta search en la vista, se utiliza para el autocompletar
  @ViewChild('search')
  public searchElementRef: ElementRef;
  // para el mapa
  @ViewChild('gmap')
  public gmapElementRef: ElementRef;
  // para el mensaje
  @ViewChild('mdlMessage')
  public messageElementRef: ElementRef;
  

//Se cargan todos los servicios
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private modalService: NgbModal,
    private complaintService: ComplaintService,
    private categoryService: CategoryService,
    private userService: UserService
    ) { }
//Funcion que se ejecuta en cada actualizacion de pantalla
  ngOnInit() {
    // Al cargar la pagina no marker info abiertos por lo que la variable la vuelve null para que no haya errores
    this.previous=null;
    // Obtiene las quejas de la base de datos
    this.getComplaints();
    // Obtiene las categorias por medio del servicio
    this.categories=this.categoryService.readAll();
    //Genera el mapa y ele asigna unas coordenadas de partida
    this.map = new Map(31.823537, -116.599811, 12);
    // Una vez la api se haya cargado hace las intrucciones entre las llaves
    this.mapsAPILoader.load().then(() => {
      // Especifica las coordenadas entre las cuales obtenga las suegerencia de busqueda, estas coordenas comprenden un rectangulo que encierra ensenada
      // Lo que hace que solo muestre lugares de ensenada
      let searchBound=new google.maps.LatLngBounds(
        new google.maps.LatLng(31.664724,-116.712976),
        new google.maps.LatLng(31.926023,-116.530393)
      );
      // Genera el geocoder
      this.geoCoder = new google.maps.Geocoder();
      // Genera un autocompletar con la instancia del text box de busqueda en la vista
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['geocode'],
        bounds: searchBound, // El cuadro de busqueda que generamos arriba
        strictBounds:true, //Esto hace que cualquier suegerencia fuera de los limites de busqueda (El cuadro especificado arriba) no los muestre
        componentRestrictions: {country: 'mx'} // que la busqueda sea en mx
      });
      // Genera un listener que se detona cada vez que el texto del buscador cambia
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          
          this.searchElementRef.nativeElement.value="";
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          // set latitude, longitude and zoom
          this.map.latitude = place.geometry.location.lat();
          this.map.longitude = place.geometry.location.lng();
          this.map.zoom=16+this.updaterzoom;
          // Este cambia de manera imperceptible el zoom para que se aplique el zoom cada actualizacion
          this.updaterzoom*=-1;
          //this.getAddress(this.map.latitude, this.map.longitude);
        });
      });
    });
    //Obtiene al usuario
    this.userService.getUser().subscribe(
      response => {
        if (response!=null){
          this.user=response['user'];
        }
        else
          this.newMarker=false;
        //console.log(this.user);
      },
      errors => {
        //console.log(errors);
      }
    );
    // Genera una instancia para el formulario de la queja
    this.newComplaint= new Complaint();
  }

  // Actualiza el mapa para que el marcador de la nueva queja siempre este en el centro
  markerDragEnd($event: any) {
    //console.log($event);
    this.map.latitude = $event.coords.lat;
    this.map.longitude = $event.coords.lng;
    this.getAddress(this.map.latitude, this.map.longitude);
    //console.log('wakanda');
  }

  //Obtiene la direccion de las coordenadas, no esta implementado en la vista pero se dejo por futuras utlidades
  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
      //console.log(results);
      //console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  // Genera el marcador de la nueva queja
  setMarker() {
    if (this.user!=null){
      this.map.longitude = this.gmapElementRef['longitude'];
      this.map.latitude = this.gmapElementRef['latitude'];
      this.newMarker = true;
    }
  }

  // Cierra la interfaz de la nueva queja
  cancelMarker() {
    this.newMarker = false;
  }

  // Abre el modal que muesta el formulario de la nueva queja
  fillComplain(mdlComplaint) {
    this.modalService.open(mdlComplaint);
  }

  // Para la imagen, no implementado
  onFileChange(event) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile != null) {
      //console.log(this.selectedFile.name);
    }
  }

  // Cierra anterior ventana de marcador
  close_window(){
    if (this.previous != null ) {
      this.previous.close()
      }    
    }

  // Detecta un nuevo click en un marcador
  clickedMarker(infowindow) {
    if (this.previous!=null) {
        this.previous.close();
    }
    this.previous = infowindow;
  }

  //Crea la una nueva queja
  createComplaint(){
    this.newComplaint.latitude=this.map.latitude;
    this.newComplaint.longitude=this.map.longitude;
    this.newComplaint.user_id=+this.user.id;
    this.modalService.dismissAll('SaveClick')
    this.complaintService.create(this.newComplaint).subscribe(
      response => {
        if (response['status']==='success'){
          this.getComplaints();
          this.showMessage(response['message']);
        }
      },
      errors => {
        //console.log();
      }
    )
    this.newComplaint=new Complaint();
    this.newMarker=false;
  }

  // Detecta el cambio el la lista de categorias para hacer el filtrado sensitivo
  categoryChanged(value:number){
      this.newComplaint.category_id=value;
  }

  // Elimina una queja
  deleteComplaint(id:number){
    this.previous.close();
    this.previous=null;
    this.complaintService.delete(id,+this.user.id).subscribe(
      response => {
          if (response['status']==='success'){
            this.getComplaints();
            this.showMessage(response['message']);
          }
      },
      errors=>{
          //console.log(errors);
      }
    )
  }

  // Coloca el mensaje y abre el modalService
  showMessage(message:string){
    this.message=message;
    //console.log(this.message);
    this.modalService.open(this.messageElementRef);
  }

  // Obtiene todas la quejas de la base de datos
  getComplaints(){
    this.previous=null;
    let user_id=null;
    let data;
    this.complaints=new Array<Complaint>();
    if (this.onlyUser&&this.user!=null)
      user_id=this.user.id;
    this.complaintService.readBy(user_id,this.filter).subscribe(
      response => {
          if (response['status']==='success'){
              data=response["data"]['complaints'];
              data.forEach(item => {
                  this.complaints.push( new Complaint(
                      item['id'],
                      item['user_id'],
                      item['category_id'],
                      item['state_id'],
                      item['original_id'],
                      item['description'],
                      item['latitude'],
                      item['longitude'],
                      item['created_at'],
                      new Category(
                          item['category']['id'],
                          item['category']['name'],
                          item['category']['icon']
                      )
                  ));
              });
          }
          //console.log(this.complaints);
          //console.log(this.user);
      },
      errors =>{
          //console.log(<any>errors);
      }
    );
  }
}
