import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../../environments/environment';
import { Cliente } from '../../../../../../interfaces/cliente.interface';

@Component({
  selector: 'app-clientes-empleado',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.scss'
})
export class ClientesEmpleado implements OnInit {

  clientes: Cliente[] = [];
  busqueda: string = '';
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Cliente[]>(`${this.apiUrl}/empleado/clientes`).subscribe({
      next: data => this.clientes = data,
      error: () => console.error('Error al cargar clientes')
    });
  }

  get clientesFiltrados(): Cliente[] {
    if (!this.busqueda) return this.clientes;
    const query = this.busqueda.toLowerCase();
    return this.clientes.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query)
    );
  }
}