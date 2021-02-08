const express = require("express");
const mysql = require("mysql");
const connConfig = require("./config.js");
var cors = require("cors");

const connection = mysql.createConnection(connConfig);

const app = express();
app.use(express.json()); // for parsing application/json
app.use(cors());

const successCallback = (response, results) => {
  response.json(results);
};

const errorCallback = (response, error) => {
  console.log(error)
  response.send(error);
};

function callQuery(query, errorCallback, successCallback) {
  connection.query(query, function (error, results) {
    if (error) {
      errorCallback(error);
    } else {
      successCallback(results);
    }
  });
}

function handleQuery(query) {
  return function (req, res) {
    callQuery(
      query(req),
      (error) => errorCallback(res, error),
      (results) => successCallback(res, results)
    );
  };
}

app.post(
  "/events",
  handleQuery((req) => {
    const params = req.body;
    if (params.eventId)
      return `SELECT Wydarzenia.CzasRoz >= NOW() AND Wydarzenia.CzasZak <= NOW() AS Trwa,Wydarzenia.CzasZak < NOW() AS Zakonczone, Wydarzenia.* FROM Wydarzenia WHERE IdW = ${params.eventId} `;
    else
      return `SELECT Wydarzenia.CzasRoz >= NOW() AND Wydarzenia.CzasZak <= NOW() AS Trwa,Wydarzenia.CzasZak < NOW() AS Zakonczone, Wydarzenia.* FROM Wydarzenia WHERE CzasZak > NOW()`;
  })
);

app.post(
  "/pastEvents",
  handleQuery(
    (req) =>
      `SELECT Wydarzenia.CzasRoz >= NOW() AND Wydarzenia.CzasZak <= NOW() AS Trwa,Wydarzenia.CzasZak < NOW() AS Zakonczone, Wydarzenia.* FROM Wydarzenia WHERE CzasZak <= NOW()`
  )
);

app.post(
  "/tickets",
  handleQuery((req) => {
    const params = req.body;
    if (params.eventId)
      return `
      SELECT Bilety.*, IF(ISNULL(Bilety.MaksIlosc), 2147483647, Bilety.MaksIlosc - IFNULL(SUM(Zakupy.IloscB), 0)) as PozostaleBilety FROM Bilety
      LEFT JOIN Zakupy ON Bilety.IdB = Zakupy.IdB
      LEFT JOIN Anulaty ON Zakupy.IdT = Anulaty.IdT
      WHERE Bilety.IdW = ${params.eventId} AND Anulaty.IdA IS NULL
      GROUP BY Bilety.IdB
      `;
    else if (params.ticketId) {
      return `
        SELECT Bilety.*, Wydarzenia.*, IF(ISNULL(Bilety.MaksIlosc), 2147483647, Bilety.MaksIlosc - IFNULL(SUM(Zakupy.IloscB), 0)) as PozostaleBilety FROM Bilety
        JOIN Wydarzenia ON Bilety.IdW = Wydarzenia.IdW
        LEFT JOIN Zakupy ON Bilety.IdB = Zakupy.IdB
        LEFT JOIN Anulaty ON Zakupy.IdT = Anulaty.IdT
        WHERE Bilety.IdB = ${params.ticketId} AND Anulaty.IdA IS NULL
        GROUP BY Bilety.IdB
        `;
    } else return ``;
  })
);

app.post(
  "/userTickets",
  handleQuery((req) => {
    const params = req.body;
    if (params.userId && params.ticketId)
      return `SELECT Wydarzenia.CzasRoz >= NOW() AND Wydarzenia.CzasZak <= NOW() AS Trwa,Wydarzenia.CzasZak < NOW() AS Zakonczone, Zakupy.*, Bilety.*, Wydarzenia.*, Anulaty.DataAnulaty FROM Zakupy
JOIN Bilety ON Zakupy.IdB = Bilety.IdB
JOIN Wydarzenia ON Bilety.IdW = Wydarzenia.IdW
LEFT JOIN Anulaty ON Zakupy.IdT = Anulaty.IdT
WHERE Zakupy.IdU = "${params.userId}" AND
Zakupy.IdT = ${params.ticketId}`;
    else if (params.userId)
      return `SELECT Wydarzenia.CzasRoz >= NOW() AND Wydarzenia.CzasZak <= NOW() AS Trwa, Wydarzenia.CzasZak < NOW() AS Zakonczone, Zakupy.*, Bilety.*, Wydarzenia.*, Anulaty.DataAnulaty FROM Zakupy
JOIN Bilety ON Zakupy.IdB = Bilety.IdB
JOIN Wydarzenia ON Bilety.IdW = Wydarzenia.IdW
LEFT JOIN Anulaty ON Zakupy.IdT = Anulaty.IdT
WHERE Zakupy.IdU = "${params.userId}"`;
    else return ``;
  })
);

app.post(
  "/cancelTicket",
  handleQuery((req) => {
    const params = req.body;
    if (params.userId && params.ticketId)
      return `
  INSERT INTO Anulaty(IdT, DataAnulaty)
  SELECT IdT, NOW()
  FROM Zakupy
  WHERE IdT = ${params.ticketId} AND IdU = "${params.userId}"`;
    else return ``;
  })
);

app.post(
  "/purchaseTicket",
  handleQuery((req) => {
    const params = req.body;
    console.log(params);
    return `
    INSERT INTO Zakupy(IdU, IdB, CenaZakupu, DataZakupu, IloscB)
    SELECT "${params.userId}", Bilety.IdB, Bilety.Cena, NOW(), ${params.count}
    FROM Bilety
    LEFT JOIN Zakupy ON Bilety.IdB = Zakupy.IdB
    WHERE Bilety.IdB = ${params.ticketId}
    GROUP BY Bilety.IdB, Bilety.MaksIlosc
    HAVING IFNULL(SUM(Zakupy.IloscB), 0) + ${params.count}  <= IFNULL(Bilety.MaksIlosc, 2147483647)
    `;
  })
);

app.post(
  "/purchaseTickets",
  handleQuery((req) => {
    const params = req.body;
    var query = "";
    params.orderedTickets.forEach(
      (ticket) =>
        (query += `INSERT INTO Zakupy(IdU, IdB, CenaZakupu, DataZakupu, IloscB)
      SELECT "${params.userId}", Bilety.IdB, Bilety.Cena, NOW(), ${ticket.amount}
      FROM Bilety
      LEFT JOIN Zakupy ON Bilety.IdB = Zakupy.IdB
      WHERE Bilety.IdB = ${ticket.ticketId}
      GROUP BY Bilety.IdB, Bilety.MaksIlosc
      HAVING IFNULL(SUM(Zakupy.IloscB), 0) + ${ticket.amount}  <= IFNULL(Bilety.MaksIlosc, 2147483647);
      `)
    );
    return query;
  })
);

app.post(
  "/newUser",
  handleQuery((req) => {
    const params = req.body;
    return `
    INSERT INTO Uzytkownicy(IdU, Imie, Nazwisko, DataUr) 
    VALUES("${params.userId}", "${params.name}", "${params.lastName}", "${params.birthdate}")
  `;
  })
);

app.post(
  "/newCorporateUser",
  handleQuery((req) => {
    const params = req.body;
    return `
    INSERT INTO Uzytkownicy(IdU, Imie, Nazwisko, DataUr) VALUES("${params.userId}", "${params.name}", "${params.lastName}", "${params.birthdate}");
    INSERT INTO Firmy(NazwaF) VALUES("${params.companyName}");
    INSERT INTO Reprezentanci(IdF, IdU) VALUES(LAST_INSERT_ID(), "${params.userId}")
    `;
  })
);

app.post(
  "/userDetails",
  handleQuery((req) => {
    const params = req.body;
    return `
      SELECT Uzytkownicy.*, Firmy.NazwaF FROM Uzytkownicy
      LEFT JOIN Reprezentanci ON Uzytkownicy.IdU = Reprezentanci.IdU
      LEFT JOIN Firmy ON Reprezentanci.IdF = Firmy.IdF
      WHERE Uzytkownicy.IdU = "${params.userId}"
    `;
  })
);

app.post(
  "/host/events",
  handleQuery((req) => {
    const params = req.body;
    return `
    SELECT Wydarzenia.CzasRoz >= NOW() AND Wydarzenia.CzasZak <= NOW() AS Trwa, Wydarzenia.CzasZak < NOW() AS Zakonczone, Wydarzenia.*, Organizowanie.*, Firmy.*, Reprezentanci.*, Uzytkownicy.*
    FROM Wydarzenia 
    INNER JOIN Organizowanie ON Wydarzenia.IdW = Organizowanie.IdW 
    INNER JOIN Firmy ON Organizowanie.IdF = Firmy.IdF
    INNER JOIN Reprezentanci ON Firmy.IdF = Reprezentanci.IdF
    INNER JOIN Uzytkownicy ON Reprezentanci.IdU = Uzytkownicy.IdU
    WHERE Uzytkownicy.IdU = "${params.userId}"
    `;
  })
);

app.post(
  "/host/pastEvents",
  handleQuery((req) => {
    const params = req.body;
    return `
    SELECT Wydarzenia.CzasRoz >= NOW() AND Wydarzenia.CzasZak <= NOW() AS Trwa, Wydarzenia.CzasZak < NOW() AS Zakonczone, Wydarzenia.*
    FROM Wydarzenia 
    JOIN Organizowanie ON Wydarzenia.IdW = Organizowanie.IdW 
    JOIN Firmy ON Organizowanie.IdF = Firmy.IdF
    JOIN Reprezentanci ON Firmy.IdF = Reprezentanci.IdF
    JOIN Uzytkownicy ON Reprezentanci.IdU = Uzytkownicy.IdU
    WHERE Uzytkownicy.IdU = "${params.userId}" AND Wydarzenia.CzasZak <= NOW()
    `;
  })
);

app.post(
  "/host/addEvent",
  handleQuery((req) => {
    const params = req.body;
    return `
    INSERT INTO Wydarzenia(NazwaW, OpisW, Grafika, CzasRoz, CzasZak, Adres, Miasto, Kraj)
    VALUES("${params.eventName}", "${params.eventDescription}", "${params.imageUrl}", "${params.eventStart}", "${params.eventEnd}", "${params.address}", "${params.city}", "${params.country}");
    INSERT INTO Organizowanie(IdW, IdF)
    SELECT LAST_INSERT_ID(), Firmy.IdF FROM Uzytkownicy
    JOIN Reprezentanci ON Uzytkownicy.IdU = Reprezentanci.IdU
    JOIN Firmy ON Reprezentanci.IdF = Firmy.IdF
    WHERE Uzytkownicy.IdU = "${params.userId}"
    `;
  })
);

app.post(
  "/host/addEventWithTickets",
  handleQuery((req) => {
    const params = req.body;
    var query = `
    INSERT INTO Wydarzenia(NazwaW, OpisW, Grafika, CzasRoz, CzasZak, Adres, Miasto, Kraj)
    VALUES("${params.eventName}", "${params.eventDescription}", "${params.imageUrl}", "${params.eventStart}", "${params.eventEnd}", "${params.address}", "${params.city}", "${params.country}");
    INSERT INTO Organizowanie(IdW, IdF)
    SELECT LAST_INSERT_ID(), Firmy.IdF FROM Uzytkownicy
    JOIN Reprezentanci ON Uzytkownicy.IdU = Reprezentanci.IdU
    JOIN Firmy ON Reprezentanci.IdF = Firmy.IdF
    WHERE Uzytkownicy.IdU = "${params.userId}";
    `;
    params.tickets.forEach((ticket) => {
      if (ticket.maxAmount)
        query += ` 
        INSERT INTO Bilety(IdW, NazwaB, Cena, MaksIlosc)
        SELECT Max(Wydarzenia.IdW), "${ticket.name}", ${ticket.price}, ${ticket.maxAmount} FROM Wydarzenia;
        INSERT INTO Zakupy(IdB, IdU, CenaZakupu, DataZakupu, IloscB)
        SELECT Max(Bilety.IdB), "admin_user", 0, NOW(), 0 FROM Bilety;         
        `;
      else
        query += ` INSERT INTO Bilety(IdW, NazwaB, Cena)
        SELECT Max(Wydarzenia.IdW), "${ticket.name}", ${ticket.price} FROM Wydarzenia;
        INSERT INTO Zakupy(IdB, IdU, CenaZakupu, DataZakupu, IloscB)
        SELECT Max(Bilety.IdB), "admin_user", 0, NOW(), 0 FROM Bilety;       
        `;
    });
    return query;
  })
);

app.post(
  "/host/salesSummary",
  handleQuery((req) => {
    const params = req.body;
    return `
    SELECT Bilety.*, SUM(Zakupy.IloscB) as Sprzedane, Bilety.MaksIlosc, SUM(Zakupy.CenaZakupu * Zakupy.IloscB) as Przychod FROM Wydarzenia
    LEFT JOIN Bilety ON Wydarzenia.IdW = Bilety.IdW
    LEFT JOIN Zakupy ON Bilety.IdB = Zakupy.IdB
    LEFT JOIN Anulaty ON Zakupy.IdT = Anulaty.IdT
    JOIN Organizowanie ON Wydarzenia.IdW = Organizowanie.IdW
    JOIN Firmy ON Firmy.IdF = Organizowanie.IdF
    JOIN Reprezentanci ON Firmy.IdF = Reprezentanci.IdF 
    WHERE Reprezentanci.IdU = "${params.userId}" AND Anulaty.IdA IS NULL AND Wydarzenia.IdW = ${params.eventId}
    GROUP BY Bilety.IdB
    `;
  })
);

app.post(
  "/host/sales",
  handleQuery((req) => {
    const params = req.body;
    return `
    SELECT Zakupy.*, Wydarzenia.*, Bilety.*, Anulaty.IdA FROM Wydarzenia
    LEFT JOIN Bilety ON Wydarzenia.IdW = Bilety.IdW
    LEFT JOIN Zakupy ON Bilety.IdB = Zakupy.IdB
    LEFT JOIN Anulaty ON Zakupy.IdT = Anulaty.IdT
    JOIN Organizowanie ON Wydarzenia.IdW = Organizowanie.IdW
    JOIN Firmy ON Firmy.IdF = Organizowanie.IdF
    JOIN Reprezentanci ON Firmy.IdF = Reprezentanci.IdF 
    WHERE Reprezentanci.IdU = "${params.userId}" AND Wydarzenia.IdW = ${params.eventId}
    `
  })
)

app.post(
  "/isHost",
  handleQuery((req) => {
    const params = req.body;
    return `
    SELECT COUNT(*) > 0 as isHost FROM Uzytkownicy
    JOIN Reprezentanci ON Uzytkownicy.IdU = Reprezentanci.IdU
    WHERE Uzytkownicy.IdU = "${params.userId}"
    `;
  })
);

app.listen(3001, () => {
  console.log("Go to http://localhost:3001/");
});
