import "reflect-metadata";

import {container} from "tsyringe";
import {Launcher} from "../Launcher";
import {BackendController} from "../website/BackendController";
import {BackendService} from "../website/BackendService";
import {FrontendController} from "../website/FrontendController";
import {FrontendService} from "../website/FrontendService";

// Registrar todas las dependencias
container.register ("BackendModule", {useClass: BackendService});
container.register ("FrontendModule", {useClass: FrontendService});
container.register ("BackendController", {useClass: BackendController});
container.register ("FrontendController", {useClass: FrontendController});
container.register ("Launcher", {useClass: Launcher});