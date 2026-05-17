import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<Cliente[]>(`${this.apiUrl}/users`, { headers }).subscribe({
      next: data => this.clientes = data.filter(u => u.role_id === 1),
      error: () => console.error('Error al cargar clientes')
    });
  }

  get clientesFiltrados(): Cliente[] {
    if (!this.busqueda) return this.clientes;
    const query = this.busqueda.toLowerCase();
    return this.clientes.filter(cliente =>
      cliente.name.toLowerCase().includes(query) ||
      cliente.email.toLowerCase().includes(query)
    );
  }
}