import { environment } from 'src/environments/environment';
import { GeneralService } from './general.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class GestionDocumentosService {

  private apiUrl = 'https://api.ipify.org/?format=json';

  constructor(private general:GeneralService) { }


guardar(parametros: any): Observable<any> {
  return this.general.postData<Request, any>(`${environment.api}/external/documentoDigitalizado`, parametros);
}

obtenerDocumentos(fechaInicio: String, fechaFin: String, propietario: String): Observable<any>{
      return this.general.getData<any>(`${environment.api}/external/documentoDigitalizado/obtenerDocumentos/${fechaInicio}/${fechaFin}/${propietario}`)
}

crearBitacora(parametros: any): Observable<any> {
  return this.general.postData<Request, any>(`${environment.api}/external/bitacora`, parametros);
}

  async getIp() {
  try {
    const response = await axios.get(this.apiUrl);
    return response.data.ip;
  } catch (error) {
    console.error('Error al obtener la IP pública:', error);
    return null;
  }
}

}
