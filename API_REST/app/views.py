from flask_restx import Resource, Namespace, abort
from .models import (get_all_compagnies, get_compagnie, create_compagnie, modify_compagnie, delete_compagnie,
                     get_all_pays, get_pays, create_pays, modify_pays, delete_pays,
                     get_all_villes, get_ville, create_ville, modify_ville, delete_ville,
                     get_all_aeroports, get_aeroport, create_aeroport, modify_aeroport, delete_aeroport,
                     get_all_terminals, get_terminal, create_terminal, delete_terminal,
                     get_all_vols, get_vol, create_vol, modify_vol, delete_vol)
from .api_models import (compagnie_model, compagnie_input_model,
                         pays_model, pays_input_model,
                         ville_model, ville_input_model,
                         aeroport_model, aeroport_input_model,
                         terminal_model, terminal_input_model,
                         vol_model, vol_input_model)
from datetime import datetime

ns = Namespace("api")

@ns.route("/compagnies")
class CompagnieCollection(Resource):
    @ns.marshal_list_with(compagnie_model)
    def get(self):
        return get_all_compagnies()
    
    @ns.expect(compagnie_input_model)
    @ns.marshal_with(compagnie_model)
    def post(self):
        compagnie = create_compagnie(nomCompagnie=ns.payload["nomCompagnie"])
        return compagnie, 201

@ns.route("/compagnies/<int:idCompagnie>")
@ns.response(404, "Compagnie not found")
class CompagnieItem(Resource):
    @ns.marshal_with(compagnie_model)
    def get(self, idCompagnie):
        compagnie = get_compagnie(idCompagnie)
        if compagnie is None:
            abort(404, "Compagnie not found")
        return compagnie
    
    @ns.expect(compagnie_input_model)
    @ns.marshal_with(compagnie_model)
    def put(self, idCompagnie):
        compagnie = modify_compagnie(idCompagnie, ns.payload["nomCompagnie"])
        if compagnie is None:
            abort(404, "Compagnie not found")
        return compagnie
    
    def delete(self, idCompagnie):
        delete_compagnie(idCompagnie)
        return {}, 204


@ns.route("/pays")
class PaysCollection(Resource):
    @ns.marshal_list_with(pays_model)
    def get(self):
        return get_all_pays()
    
    @ns.expect(pays_input_model)
    @ns.marshal_with(pays_model)
    def post(self):
        pays = create_pays(nomPays=ns.payload["nomPays"])
        return pays, 201

@ns.route("/pays/<int:codePays>")
@ns.response(404, "Pays not found")
class PaysItem(Resource):
    @ns.marshal_with(pays_model)
    def get(self, codePays):
        pays = get_pays(codePays)
        if pays is None:
            abort(404, "Pays not found")
        return pays
    
    @ns.expect(pays_input_model)
    @ns.marshal_with(pays_model)
    def put(self, codePays):
        pays = modify_pays(codePays, ns.payload["nomPays"])
        if pays is None:
            abort(404, "Pays not found")
        return pays
    
    def delete(self, codePays):
        delete_pays(codePays)
        return {}, 204


@ns.route("/villes")
class VilleCollection(Resource):
    @ns.marshal_list_with(ville_model)
    def get(self):
        return get_all_villes()
    
    @ns.expect(ville_input_model)
    @ns.marshal_with(ville_model)
    def post(self):
        ville = create_ville(nomVille=ns.payload["nomVille"],codePays=ns.payload["codePays"])
        return ville, 201

@ns.route("/villes/<int:idVille>")
@ns.response(404, "Ville not found")
class VilleItem(Resource):
    @ns.marshal_with(ville_model)
    def get(self, idVille):
        ville = get_ville(idVille)
        if ville is None:
            abort(404, "Ville not found")
        return ville
    
    @ns.expect(ville_input_model)
    @ns.marshal_with(ville_model)
    def put(self, idVille):
        ville = modify_ville(idVille, ns.payload["nomVille"], ns.payload["codePays"])
        if ville is None:
            abort(404, "Ville not found")
        return ville
    
    def delete(self, idVille):
        delete_ville(idVille)
        return {}, 204


@ns.route("/aeroports")
class AeroportCollection(Resource):
    @ns.marshal_list_with(aeroport_model)
    def get(self):
        return get_all_aeroports()
    
    @ns.expect(aeroport_input_model)
    @ns.marshal_with(aeroport_model)
    def post(self):
        aeroport = create_aeroport(nomAeroport=ns.payload["nomAeroport"],idVille=ns.payload["idVille"])
        return aeroport, 201

@ns.route("/aeroports/<int:idAeroport>")
@ns.response(404, "Aeroport not found")
class AeroportItem(Resource):
    @ns.marshal_with(aeroport_model)
    def get(self, idAeroport):
        aeroport = get_aeroport(idAeroport)
        if aeroport is None:
            abort(404, "Aeroport not found")
        return aeroport
    
    @ns.expect(aeroport_input_model)
    @ns.marshal_with(aeroport_model)
    def put(self, idAeroport):
        aeroport = modify_aeroport(idAeroport, ns.payload["nomAeroport"], ns.payload["idVille"])
        if aeroport is None:
            abort(404, "Aeroport not found")
        return aeroport
    
    def delete(self, idAeroport):
        delete_aeroport(idAeroport)
        return {}, 204


@ns.route("/terminaux")
class TerminalCollection(Resource):
    @ns.marshal_list_with(terminal_model)
    def get(self):
        return get_all_terminals()
    
    @ns.expect(terminal_input_model)
    @ns.marshal_with(terminal_model)
    def post(self):
        terminal = create_terminal(idAeroport=ns.payload["idAeroport"],numTerminal=ns.payload["numTerminal"])
        return terminal, 201

@ns.route("/terminaux/<int:idAeroport>/<string:numTerminal>")
@ns.response(404, "Terminal not found")
class TerminalItem(Resource):
    @ns.marshal_with(terminal_model)
    def get(self, idAeroport, numTerminal):
        terminal = get_terminal(idAeroport, numTerminal)
        if terminal is None:
            abort(404, "Terminal not found")
        return terminal
    
    def delete(self, idAeroport, numTerminal):
        delete_terminal(idAeroport, numTerminal)
        return {}, 204


@ns.route("/vols")
class VolCollection(Resource):
    @ns.marshal_list_with(vol_model)
    def get(self):
        return get_all_vols()
    
    @ns.expect(vol_input_model)
    @ns.marshal_with(vol_model)
    def post(self):
        vol = create_vol(
            idCompagnie=ns.payload["idCompagnie"],
            numVol=ns.payload["numVol"],
            dateHeureDep=datetime.fromisoformat(ns.payload["dateHeureDep"]) if isinstance(ns.payload["dateHeureDep"], str) else ns.payload["dateHeureDep"],
            dateHeureArr=datetime.fromisoformat(ns.payload["dateHeureArr"]) if isinstance(ns.payload["dateHeureArr"], str) else ns.payload["dateHeureArr"],
            idAeroportDep=ns.payload["idAeroportDep"],
            numTerminalDep=ns.payload["numTerminalDep"],
            idAeroportArr=ns.payload["idAeroportArr"],
            numTerminalArr=ns.payload["numTerminalArr"]
        )
        return vol, 201

@ns.route("/vols/<int:idCompagnie>/<string:numVol>/<string:dateHeureDep>")
@ns.response(404, "Vol not found")
class VolItem(Resource):
    @ns.marshal_with(vol_model)
    def get(self, idCompagnie, numVol, dateHeureDep):
        date = datetime.fromisoformat(dateHeureDep)
        vol = get_vol(idCompagnie, numVol, date)
        if vol is None:
            abort(404, "Vol not found")
        return vol
    
    @ns.expect(vol_input_model)
    @ns.marshal_with(vol_model)
    def put(self, idCompagnie, numVol, dateHeureDep):
        date = datetime.fromisoformat(dateHeureDep)
        vol = modify_vol(
            idCompagnie, numVol, date,
            datetime.fromisoformat(ns.payload["dateHeureArr"]) if isinstance(ns.payload["dateHeureArr"], str) else ns.payload["dateHeureArr"],
            ns.payload["idAeroportDep"],
            ns.payload["numTerminalDep"],
            ns.payload["idAeroportArr"],
            ns.payload["numTerminalArr"]
        )
        if vol is None:
            abort(404, "Vol not found")
        return vol
    
    def delete(self, idCompagnie, numVol, dateHeureDep):
        date = datetime.fromisoformat(dateHeureDep)
        delete_vol(idCompagnie, numVol, date)
        return {}, 204
