```markdown
# Kubernetes_Narinder

## Kubernetes Deployment of Dockerized Full-Stack To-Do Application

A Dockerized full-stack To-Do application deployed and tested using **Kubernetes with Minikube**.

The project consists of:

- **Flask** backend
- **Node.js + Express.js** frontend
- **Docker** containerization
- **Docker Hub** container images
- **Kubernetes Deployments**
- **Kubernetes Services**
- **Minikube** for local Kubernetes deployment
- Frontend-to-backend communication using Kubernetes Service discovery

---

## 1. Project Overview

This project demonstrates how a Dockerized full-stack web application can be deployed and managed using Kubernetes.

The application allows users to enter:

- Item Name
- Item Description

The frontend sends the submitted data to the Flask backend. The backend validates the input and returns a JSON response confirming that the To-Do item was received.

The application was containerized using Docker and then deployed to a Kubernetes cluster created using Minikube.

---

## 2. Objectives

The main objectives of this project are:

1. Create a Dockerized full-stack application.
2. Build separate Docker images for the frontend and backend.
3. Store the Docker images on Docker Hub.
4. Create a local Kubernetes cluster using Minikube.
5. Deploy the backend using a Kubernetes Deployment.
6. Deploy the frontend using a Kubernetes Deployment.
7. Expose the backend using a ClusterIP Service.
8. Expose the frontend using a NodePort Service.
9. Configure frontend-to-backend communication using Kubernetes Service discovery.
10. Verify Kubernetes Deployments, Pods, and Services.
11. Test the complete application through a web browser.

---

## 3. Technologies Used

| Technology | Purpose |
|---|---|
| Python | Backend programming language |
| Flask | Backend web framework |
| Node.js | Frontend server runtime |
| Express.js | Frontend web server |
| HTML5 | User interface |
| JavaScript | Frontend interaction |
| Docker | Application containerization |
| Docker Hub | Container image registry |
| Kubernetes | Container orchestration |
| Minikube | Local Kubernetes cluster |
| kubectl | Kubernetes command-line tool |
| YAML | Kubernetes configuration |

---

## 4. Application Architecture

```text
                         User
                           |
                           v
                +----------------------+
                | Kubernetes NodePort  |
                | frontend-service     |
                | Port 3002             |
                +----------+-----------+
                           |
                           v
                +----------------------+
                | Frontend Deployment  |
                | Node.js + Express    |
                | Container Port 3002  |
                +----------+-----------+
                           |
                           | BACKEND_URL
                           | http://backend-service:5000
                           v
                +----------------------+
                | Backend Service      |
                | ClusterIP             |
                | Port 5000             |
                +----------+-----------+
                           |
                           v
                +----------------------+
                | Backend Deployment   |
                | Flask Application    |
                | Container Port 5000  |
                +----------------------+
```

---

## 5. Application Flow

The application follows this flow:

1. The user opens the frontend through the Kubernetes NodePort Service.
2. The frontend displays the To-Do form.
3. The user enters an item name and item description.
4. The browser sends a POST request to `/api/submit`.
5. The Express server receives the request.
6. Express forwards the request to the Flask backend.
7. Inside Kubernetes, the frontend connects to:
   `http://backend-service:5000`
8. Flask receives the request through the `/submit` endpoint.
9. The backend validates the input.
10. The backend returns a JSON response.
11. The frontend displays the response message.

Successful application response:

```text
To-Do item received successfully
```

---

## 6. Backend

The backend is implemented using **Python Flask**.

### Port

```text
5000
```

### Backend Endpoints

#### GET /

Returns:

```json
{
  "message": "Flask backend is running successfully"
}
```

#### POST /submit

The endpoint accepts:

```json
{
  "itemName": "Kubernetes Test",
  "itemDescription": "Testing frontend and backend communication through Kubernetes"
}
```

If both fields are provided, the backend returns:

```json
{
  "message": "To-Do item received successfully",
  "itemName": "Kubernetes Test",
  "itemDescription": "Testing frontend and backend communication through Kubernetes"
}
```

If either field is missing, the backend returns an HTTP `400` response with an error message.

### Backend Files

```text
backend/
├── app.py
├── Dockerfile
└── requirements.txt
```

---

## 7. Frontend

The frontend is implemented using:

- Node.js
- Express.js
- HTML
- JavaScript

### Port

```text
3002
```

The Express server serves the static frontend from the `public` directory.

The frontend provides:

- Item Name input
- Item Description input
- Submit To-Do button
- Response message

The browser sends the request to:

```text
/api/submit
```

The Express server forwards the request to the Flask backend.

### Frontend Files

```text
frontend/
├── Dockerfile
├── package.json
├── package-lock.json
├── server.js
└── public/
    └── index.html
```

---

## 8. Docker Images

The application uses two Docker images stored on Docker Hub.

### Backend Image

```text
narinder15/docker-narinder-backend:latest
```

### Frontend Image

```text
narinder15/docker-narinder-frontend:latest
```

These images are referenced directly by the Kubernetes Deployment manifests.

---

## 9. Kubernetes Cluster

The application was deployed using **Minikube** with the Docker driver.

### Minikube Profile

```text
k8s-assignment
```

### Kubernetes Version

```text
v1.35.1
```

### Minikube Version

```text
v1.38.1
```

### Container Driver

```text
Docker
```

The cluster was started using:

```powershell
minikube start -p k8s-assignment --driver=docker
```

The Kubernetes node was verified using:

```powershell
kubectl get nodes
```

The node reached the following state:

```text
STATUS: Ready
```

---

## 10. Kubernetes Deployments

Two Kubernetes Deployments are used in the project.

### Backend Deployment

File:

```text
k8s/backend-deployment.yaml
```

Configuration:

```text
Name: backend-deployment
Replicas: 1
Container Port: 5000
Image: narinder15/docker-narinder-backend:latest
```

### Frontend Deployment

File:

```text
k8s/frontend-deployment.yaml
```

Configuration:

```text
Name: frontend-deployment
Replicas: 1
Container Port: 3002
Image: narinder15/docker-narinder-frontend:latest
```

The frontend Deployment uses the following environment variable:

```text
BACKEND_URL=http://backend-service:5000
```

This allows the frontend container to communicate with the backend using the Kubernetes Service name.

---

## 11. Kubernetes Services

Two application Services are configured.

### Backend Service

File:

```text
k8s/backend-service.yaml
```

Configuration:

```text
Name: backend-service
Type: ClusterIP
Port: 5000
Target Port: 5000
```

The backend uses `ClusterIP` because it only needs to be accessible from inside the Kubernetes cluster.

The frontend communicates with it using:

```text
http://backend-service:5000
```

### Frontend Service

File:

```text
k8s/frontend-service.yaml
```

Configuration:

```text
Name: frontend-service
Type: NodePort
Port: 3002
Target Port: 3002
NodePort: 32096
```

The NodePort Service exposes the frontend so that it can be accessed externally.

---

## 12. Kubernetes Manifest Files

The project contains four Kubernetes YAML files:

```text
k8s/
├── backend-deployment.yaml
├── backend-service.yaml
├── frontend-deployment.yaml
└── frontend-service.yaml
```

### Deploy Backend

```powershell
kubectl apply -f .\k8s\backend-deployment.yaml
kubectl apply -f .\k8s\backend-service.yaml
```

### Deploy Frontend

```powershell
kubectl apply -f .\k8s\frontend-deployment.yaml
kubectl apply -f .\k8s\frontend-service.yaml
```

---

## 13. Verification Commands

### Check Kubernetes Nodes

```powershell
kubectl get nodes
```

### Check All Pods

```powershell
kubectl get pods -A
```

### Check Deployments

```powershell
kubectl get deployments
```

### Check Pods

```powershell
kubectl get pods
```

### Check Services

```powershell
kubectl get services
```

### Access the Frontend

```powershell
minikube service frontend-service -p k8s-assignment --url
```

---

## 14. Final Kubernetes Status

The final deployment was successfully verified.

### Deployments

```text
NAME                  READY   UP-TO-DATE   AVAILABLE
backend-deployment    1/1     1            1
frontend-deployment   1/1     1            1
```

### Pods

```text
backend-deployment-65f9b99f89-rn6jx
READY: 1/1
STATUS: Running
RESTARTS: 0

frontend-deployment-5554478548-p28xj
READY: 1/1
STATUS: Running
RESTARTS: 0
```

### Services

```text
backend-service    ClusterIP    5000/TCP
frontend-service   NodePort     3002:32096/TCP
```

---

## 15. Application Testing

The frontend was exposed using:

```powershell
minikube service frontend-service -p k8s-assignment --url
```

The generated local URL was:

```text
http://127.0.0.1:64183
```

The application was opened in a web browser and the To-Do form was tested.

A test item was submitted through the frontend.

The application successfully returned:

```text
To-Do item received successfully
```

This confirms successful communication between the frontend and backend through Kubernetes.

### Communication Flow

```text
Browser
   |
   v
frontend-service
   |
   v
Frontend Pod
   |
   | http://backend-service:5000
   v
backend-service
   |
   v
Backend Pod
   |
   v
Flask /submit
   |
   v
JSON Response
```

---

## 16. Troubleshooting

### Minikube Cluster Issue

The original Minikube profile experienced Kubernetes API server health issues and did not create the expected application Pods.

Instead of deleting the existing Minikube profile, a separate profile was created:

```powershell
minikube start -p k8s-assignment --driver=docker
```

This provided a clean Kubernetes environment for the project without modifying the existing Minikube profile.

### Docker Network Warning

During creation of the new Minikube profile, Minikube reported that it could not find a dedicated Docker network subnet.

Despite this warning, Minikube completed successfully and the Kubernetes node became:

```text
Ready
```

The Kubernetes control-plane components and application workloads subsequently ran successfully.

### Frontend-to-Backend Communication

The frontend Deployment uses:

```text
BACKEND_URL=http://backend-service:5000
```

This allows Kubernetes DNS/service discovery to route frontend requests to the backend Service.

The end-to-end browser test successfully returned:

```text
To-Do item received successfully
```

---

## 17. Kubernetes Concepts Demonstrated

### Deployment

Deployments manage the frontend and backend Pods and maintain the desired number of replicas.

### Pod

Pods run the application containers inside the Kubernetes cluster.

### Service

Services provide stable networking and service discovery for Kubernetes workloads.

### ClusterIP

The backend uses a ClusterIP Service for internal cluster communication.

```text
backend-service
```

### NodePort

The frontend uses a NodePort Service to expose the application outside the cluster.

```text
frontend-service
```

### Kubernetes DNS

The frontend communicates with the backend using the Kubernetes Service name:

```text
backend-service
```

instead of relying on a Pod IP address.

### Minikube

Minikube provides a local Kubernetes environment for development and testing.

### kubectl

kubectl is used to create, inspect, and manage Kubernetes resources.

---

## 18. Project Structure

```text
Kubernetes_Narinder/
│
├── backend/
│   ├── app.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   └── public/
│       └── index.html
│
├── k8s/
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   └── frontend-service.yaml
│
├── screenshots/
│   ├── 01_kubernetes_tools_check.png
│   ├── 02_minikube_node_status.png
│   ├── 03_kubernetes_yaml_validation.png
│   ├── 04_kubernetes_services.png
│   ├── 05_kubernetes_deployments_pods.png
│   ├── 06_kubernetes_frontend.png
│   ├── 07_kubernetes_frontend_backend_test.png
│   └── 08_kubernetes_final_status.png
│
├── .gitignore
└── README.md
```

---

## 19. How to Run the Project

### Step 1 — Start Minikube

```powershell
minikube start -p k8s-assignment --driver=docker
```

### Step 2 — Verify the Cluster

```powershell
kubectl get nodes
```

The node should show:

```text
Ready
```

### Step 3 — Deploy the Backend

```powershell
kubectl apply -f .\k8s\backend-deployment.yaml
kubectl apply -f .\k8s\backend-service.yaml
```

### Step 4 — Deploy the Frontend

```powershell
kubectl apply -f .\k8s\frontend-deployment.yaml
kubectl apply -f .\k8s\frontend-service.yaml
```

### Step 5 — Verify Pods

```powershell
kubectl get pods
```

Both application Pods should reach:

```text
1/1 Running
```

### Step 6 — Verify Services

```powershell
kubectl get services
```

The services should include:

```text
backend-service
frontend-service
```

### Step 7 — Access the Application

```powershell
minikube service frontend-service -p k8s-assignment --url
```

Open the generated URL in a web browser.

---

## 20. Conclusion

The Dockerized full-stack To-Do application was successfully deployed and tested using Kubernetes with Minikube.

The project demonstrates:

- Dockerized Flask backend
- Dockerized Node.js/Express frontend
- Docker Hub image usage
- Kubernetes Deployments
- Kubernetes Pods
- Kubernetes Services
- ClusterIP networking
- NodePort networking
- Kubernetes service discovery
- Frontend-to-backend communication
- Browser-based application testing
- Kubernetes resource verification

The final application successfully processed a To-Do submission and returned:

```text
To-Do item received successfully
```

The project demonstrates the complete workflow of taking a containerized application and deploying it as a multi-component application on Kubernetes.
```
