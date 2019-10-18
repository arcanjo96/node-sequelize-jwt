module.exports = {
  dialect: "postgres",
  host: "localhost",
  port: "5444",
  username: "postgres",
  password: "docker",
  database: "gobarber",
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
};
