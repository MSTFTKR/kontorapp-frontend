import { Button, Grid, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { login } from "../api/data/login";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Loginpage() {

  const [logins, setLogins] = useState(true);
  const [tcVkn, setTcVkn] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [tokenFlag, setTokenFlag] = useState(false);
  useEffect(() => {
    const login = Cookies.get("authToken");
    if (login) {
      navigate("/anasayfa");
    } else {
      setTokenFlag(true);
    }
  }, []);
  const handleLogin = async () => {
    const datas = await login(tcVkn, password)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        setLogins(false)
        console.log("Geçersiz Giriş", err);
      });
    if (datas) {
      Cookies.set("authToken", datas.token, { expires: 1 / 24 });
      Cookies.set("usertcVkn", datas.tcVkn, { expires: 1 / 24 });
      navigate("/anasayfa");
    }
  };
  return (
    <Grid
      container
      sx={{
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        display: tokenFlag === true ? "flex" : "none",
      }}
    >
      <Grid item className="gridBorder2" sx={{ padding: "2%" }}>
        <Grid
          item
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
          
            label="TC NO-VKN GİRİNİZ"
            onChange={(e) => {
              setTcVkn(e.target.value);
            }}
          ></TextField>

          <TextField

            label="ŞİFRE GİRİNİZ"
            type="password"
            autoComplete="current-password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          
          {logins===false?<span style={{color:"red"}}>Giriş Başarısız. Lütfen Bilgilerinizi Doğru Giriniz</span>:''}
          <Button
            sx={{
              backgroundColor: "#2E4D58",
              color: "#D7E3E5",
              ":hover": {
                backgroundColor: "#9bb1b9",
                color:"#041820"
              },
            }}
            onClick={handleLogin}
          > 
            <b>Giriş Yap</b>
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
export default Loginpage;
