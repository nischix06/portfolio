<RadioSidebar />

      {/* Dock */}
      <div className="dock">
        {NAV.map(({ id, icon, label }) => (
          <div
            key={id}
            className={`dock-item ${wins.find(w => w.id === id) ? "active" : ""}`}
            onClick={() => openWin(id)}
          >
            <div className="dock-box">{icon}</div>
            <span className="dock-label">{label}</span>
          </div>
        ))}
      </div>
    </>
  )
}
