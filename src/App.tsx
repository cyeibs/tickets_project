import React from "react";
import { IconButton, TextField, Loader } from "@shared/ui";
import "@shared/styles/global.scss";

const App: React.FC = () => {
  return (
    <div className="container" style={{ padding: "40px" }}>
      <h1 className="t24">LupApp - FSD Structure</h1>

      <div style={{ marginTop: "24px", display: "flex", gap: "16px" }}>
        <IconButton icon={<span>+</span>} aria-label="Add item" />

        <IconButton
          icon={<span>-</span>}
          variant="secondary"
          aria-label="Remove item"
        />

        <IconButton
          icon={<span>×</span>}
          variant="transparent"
          aria-label="Close"
        />
      </div>

      <div style={{ marginTop: "24px", maxWidth: "400px" }}>
        <TextField label="Username" placeholder="Enter your username" />

        <div style={{ marginTop: "16px" }}>
          <TextField
            label="Password"
            type="password"
            placeholder="Enter your password"
            variant="filled"
          />
        </div>

        <div style={{ marginTop: "16px" }}>
          <TextField
            label="Email"
            type="email"
            placeholder="Enter your email"
            error="Please enter a valid email address"
          />
        </div>
      </div>

      <div
        style={{
          marginTop: "24px",
          display: "flex",
          gap: "24px",
          alignItems: "center",
        }}
      >
        <Loader size="small" />
        <Loader size="medium" />
        <Loader size="large" />
        <Loader size="medium" color="secondary" />
        <Loader size="medium" color="white" />
      </div>
    </div>
  );
};

export default App;
