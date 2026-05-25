// API URL
const API_URL = 'http://localhost:3000/api/services';

let currentDeleteId = null;
let isEditing = false;

function showNotification(message, type = 'success') {
    const bgColor = type === 'success' ? '#27ae60' : '#e74c3c';
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    const notification = document.createElement('div');
    notification.className = 'toast-notification';
    notification.style.cssText = `
        background: ${bgColor};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        margin-bottom: 10px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        cursor: pointer;
    `;
    notification.innerHTML = `
        <i class="fas ${icon}"></i> ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    notification.onclick = () => notification.remove();
}

async function loadServices() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Error al cargar servicios');
        }
        
        const data = await response.json();
        displayServices(data.data);
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al cargar servicios: ' + error.message, 'error');
        document.getElementById('services-list').innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle"></i> Error al cargar servicios
                </div>
            </div>
        `;
    }
}

function displayServices(services) {
    const container = document.getElementById('services-list');
    
    if (!services || services.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i> No hay servicios registrados
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = services.map(service => `
        <div class="col-md-6 col-lg-6 service-card" data-id="${service._id}">
            <div class="card h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title mb-0">
                            <i class="fas fa-cogs"></i> ${escapeHtml(service.name)}
                        </h5>
                        <span class="badge bg-${service.status === 'activo' ? 'success' : 'secondary'} status-badge">
                            ${service.status === 'activo' ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>
                    
                    <span class="badge bg-primary badge-category mb-2">
                        ${service.category.replace('_', ' ')}
                    </span>
                    
                    <p class="card-text small">${escapeHtml(service.description)}</p>
                    
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <div>
                            <small class="text-muted">
                                <i class="fas fa-clock"></i> ${service.duration}
                            </small>
                            <br>
                            <span class="price-tag">
                                $${service.price.toFixed(2)}
                            </span>
                        </div>
                        <div>
                            <button class="btn btn-sm btn-edit" onclick="editService('${service._id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-delete" onclick="deleteServicePrompt('${service._id}', '${escapeHtml(service.name)}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.getElementById('service-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const serviceId = document.getElementById('service-id').value;
    const serviceData = {
        name: document.getElementById('name').value,
        category: document.getElementById('category').value,
        description: document.getElementById('description').value,
        duration: document.getElementById('duration').value,
        price: parseFloat(document.getElementById('price').value),
        status: document.getElementById('status').value
    };
    
    try {
        let response;
        
        if (serviceId && isEditing) {
           
            response = await fetch(`${API_URL}/${serviceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(serviceData)
            });
            
            if (response.ok) {
                showNotification('Servicio actualizado exitosamente', 'success');
                resetForm();
            }
        } else {
           
            response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(serviceData)
            });
            
            if (response.ok) {
                showNotification('Servicio creado exitosamente', 'success');
                resetForm();
            }
        }
        
        if (response && response.ok) {
            await loadServices();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Error al guardar servicio');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification(error.message, 'error');
    }
});

window.editService = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        
        if (!response.ok) {
            throw new Error('Error al obtener servicio');
        }
        
        const data = await response.json();
        const service = data.data;
        
        document.getElementById('service-id').value = service._id;
        document.getElementById('name').value = service.name;
        document.getElementById('category').value = service.category;
        document.getElementById('description').value = service.description;
        document.getElementById('duration').value = service.duration;
        document.getElementById('price').value = service.price;
        document.getElementById('status').value = service.status;
        
        document.getElementById('form-title').innerHTML = '<i class="fas fa-edit"></i> Editar Servicio';
        document.getElementById('submit-btn').innerHTML = '<i class="fas fa-update"></i> Actualizar Servicio';
        document.getElementById('cancel-btn').style.display = 'block';
        
        isEditing = true;
        
        document.getElementById('service-form').scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al cargar servicio para editar', 'error');
    }
};

window.deleteServicePrompt = (id, name) => {
    currentDeleteId = id;
    document.getElementById('delete-service-name').textContent = name;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
};

document.getElementById('confirm-delete').addEventListener('click', async () => {
    if (!currentDeleteId) return;
    
    try {
        const response = await fetch(`${API_URL}/${currentDeleteId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification('Servicio eliminado exitosamente', 'success');
            await loadServices();
           
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            deleteModal.hide();
            currentDeleteId = null;
        } else {
            throw new Error('Error al eliminar servicio');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al eliminar servicio', 'error');
    }
});

function resetForm() {
    document.getElementById('service-form').reset();
    document.getElementById('service-id').value = '';
    document.getElementById('form-title').innerHTML = '<i class="fas fa-plus-circle"></i> Nuevo Servicio';
    document.getElementById('submit-btn').innerHTML = '<i class="fas fa-save"></i> Guardar Servicio';
    document.getElementById('cancel-btn').style.display = 'none';
    isEditing = false;
}

document.getElementById('cancel-btn').addEventListener('click', resetForm);

loadServices();