const Trayectoria = () => {
  return (
    <iframe
      src="/trayectoria/index.html"
      title="Trayectoria — Jhonkarly ALVAREZ"
      style={{
        width: "100vw",
        height: "100vh",
        border: "none",
        display: "block",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 50,
      }}
    />
  );
};

export default Trayectoria;
