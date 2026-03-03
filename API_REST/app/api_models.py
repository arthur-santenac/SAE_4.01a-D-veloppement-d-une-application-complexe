from flask_restx import fields
from .extensions import api

compagnie_model = api.model("Compagnie", {
    "idCompagnie": fields.Integer(required=True, description="Identifiant de la compagnie"),
    "nomCompagnie": fields.String(required=True, description="Nom de la compagnie"),
    "uri": fields.Url("api_compagnie_item", absolute=True),
})

compagnie_input_model = api.model("CompagnieInput", {
    "nomCompagnie": fields.String(required=True),
})

pays_model = api.model("Pays", {
    "codePays": fields.Integer(required=True, description="Code du pays"),
    "nomPays": fields.String(required=True, description="Nom du pays"),
    "uri": fields.Url("api_pays_item", absolute=True),
})

pays_input_model = api.model("PaysInput", {
    "nomPays": fields.String(required=True),
})

ville_model = api.model("Ville", {
    "idVille": fields.Integer(description="Identifiant de la ville"),
    "nomVille": fields.String(required=True, description="Nom de la ville"),
    "codePays": fields.Integer(required=True, description="Code du pays"),
    "uri": fields.Url("api_ville_item", absolute=True),
})

ville_input_model = api.model("VilleInput", {
    "nomVille": fields.String(required=True),
    "codePays": fields.Integer(required=True),
})

aeroport_model = api.model("Aeroport", {
    "idAeroport": fields.Integer(description="Identifiant de l'aéroport"),
    "nomAeroport": fields.String(required=True, description="Nom de l'aéroport"),
    "idVille": fields.Integer(required=True, description="Identifiant de la ville"),
    "uri": fields.Url("api_aeroport_item", absolute=True),
})

aeroport_input_model = api.model("AeroportInput", {
    "nomAeroport": fields.String(required=True),
    "idVille": fields.Integer(required=True),
})

terminal_model = api.model("Terminal", {
    "idAeroport": fields.Integer(required=True, description="Identifiant de l'aéroport"),
    "numTerminal": fields.String(required=True, description="Numéro du terminal"),
})

terminal_input_model = api.model("TerminalInput", {
    "idAeroport": fields.Integer(required=True),
    "numTerminal": fields.String(required=True),
})

vol_model = api.model("Vol", {
    "idCompagnie": fields.Integer(required=True, description="Identifiant de la compagnie"),
    "numVol": fields.String(required=True, description="Numéro du vol"),
    "dateHeureDep": fields.DateTime(required=True, description="Date et heure de départ"),
    "dateHeureArr": fields.DateTime(required=True, description="Date et heure d'arrivée"),
    "idAeroportDep": fields.Integer(required=True, description="Identifiant de l'aéroport de départ"),
    "numTerminalDep": fields.String(required=True, description="Numéro du terminal de départ"),
    "idAeroportArr": fields.Integer(required=True, description="Identifiant de l'aéroport d'arrivée"),
    "numTerminalArr": fields.String(required=True, description="Numéro du terminal d'arrivée"),
})

vol_input_model = api.model("VolInput", {
    "idCompagnie": fields.Integer(required=True),
    "numVol": fields.String(required=True),
    "dateHeureDep": fields.DateTime(required=True),
    "dateHeureArr": fields.DateTime(required=True),
    "idAeroportDep": fields.Integer(required=True),
    "numTerminalDep": fields.String(required=True),
    "idAeroportArr": fields.Integer(required=True),
    "numTerminalArr": fields.String(required=True),
})