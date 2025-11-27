// src/pages/Dashboard.tsx — EchoArt Dashboard (Neón + Surreal + Glass)
import React from 'react';

const S3_BASE =
  "https://api-gestion-usuarios-dev-images-851725327526.s3.amazonaws.com/";

// IMÁGENES DEL USUARIO
const userImages = [
"users/6a8b38dc-b0d5-4368-a6d5-d84fdb6ae3dd/7f043b13-384f-465c-9f26-ec8685176554.jpg",
  "users/6a8b38dc-b0d5-4368-a6d5-d84fdb6ae3dd/19753035-62c5-4d30-96ba-f8fb3f5b11ec.jpg",
  "users/6a8b38dc-b0d5-4368-a6d5-d84fdb6ae3dd/9e0361e7-8be6-4e16-a901-e2c25edca854.jpeg",
];

// IMÁGENES GENERADAS (mismo orden)
const generatedImages = [
  "users/6a8b38dc-b0d5-4368-a6d5-d84fdb6ae3dd/generate/openart-image_eBC_hSjM_1764260157135_raw.jpg",
  "users/6a8b38dc-b0d5-4368-a6d5-d84fdb6ae3dd/generate/openart-image_MNpdcR_4_1764259644827_raw.jpg",
];

const Dashboard: React.FC = () => {
  const downloadImage = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop() || "imagen.jpg";
    link.click();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Tu Galería Cósmica ✨</h1>
      <p style={styles.subtitle}>
        Observa la metamorfosis entre tus imágenes originales y las versiones
        reinterpretadas por IA.
      </p>

      <div style={styles.grid}>
        {userImages.map((userImg, i) => {
          const userURL = S3_BASE + userImg;
          const generatedURL = generatedImages[i]
            ? S3_BASE + generatedImages[i]
            : null;

          return (
            <div key={i} style={styles.cardRow}>
              {/* Imagen original */}
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Original</h3>
                <img src={userURL} style={styles.image} />
                <button
                  style={styles.downloadBtn}
                  onClick={() => downloadImage(userURL)}
                >
                  Descargar ⬇️
                </button>
              </div>

              {/* Flecha */}
              <div style={styles.arrow}>➡️</div>

              {/* Imagen generada */}
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Generado</h3>

                {generatedURL ? (
                  <>
                    <img src={generatedURL} style={styles.image} />
                    <button
                      style={styles.downloadBtn}
                      onClick={() => downloadImage(generatedURL)}
                    >
                      Descargar ⬇️
                    </button>
                  </>
                ) : (
                  <p style={styles.noData}>Sin imagen generada aún</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ===========================================================
   🎨 ESTILO NEÓN + GLASSMORPHISM + PORTAL CÓSMICO
   =========================================================== */
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "60px 20px",
    minHeight: "calc(100vh - 140px)",
    background: "linear-gradient(135deg, #0a0018, #1e003d, #280044)",
    color: "white",
    textAlign: "center",
  },

  title: {
    fontSize: "3em",
    fontWeight: 800,
    background: "linear-gradient(120deg, #ff70e0, #a770ff, #57d0ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "10px",
    textShadow: "0 0 15px rgba(255,150,255,0.5)",
  },

  subtitle: {
    fontSize: "1.2em",
    color: "#d8cfff",
    marginBottom: "40px",
  },

  grid: {
    display: "flex",
    flexDirection: "column",
    gap: "45px",
    alignItems: "center",
  },

  cardRow: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
  },

  card: {
    width: "320px",
    padding: "20px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.2)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 0 25px rgba(160,80,255,0.4)",
    textAlign: "center",
  },

  cardTitle: {
    fontSize: "1.2em",
    marginBottom: "12px",
    color: "#ffb9ff",
  },

  arrow: {
    fontSize: "2em",
    opacity: 0.8,
  },

  image: {
    width: "100%",
    borderRadius: "10px",
    marginBottom: "12px",
    boxShadow: "0 0 20px rgba(167,112,255,0.7)",
  },

  downloadBtn: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg, #6c5ce7, #a770ff, #57d9ff)",
    color: "white",
    fontWeight: 600,
    boxShadow: "0 0 10px rgba(108,92,231,0.5)",
  },

  noData: {
    color: "#ff9b9b",
    fontStyle: "italic",
  },
};

export default Dashboard;
