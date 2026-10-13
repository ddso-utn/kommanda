# Código a Voluntad — Diagrama de clases del dominio

```mermaid
classDiagram
    class Colectivo {
        +String nombre
        +String descripcion
        +Ubicacion ubicacion
        +TipoColectivo tipo
        +List~Proyecto~ proyectos
        +agregarProyecto(Proyecto)
    }

    class TipoColectivo {
        +String nombre
        +String descripcion
    }

    class Ubicacion {
        +NivelUbicacion nivel
        +String detalle
    }

    class NivelUbicacion {
        <<enumeration>>
        PAIS
        PROVINCIA
        CIUDAD_O_BARRIO
    }

    class Proyecto {
        +String titulo
        +String descripcion
        +List~Perfil~ perfiles
        +Boolean finalizado
        +int porcentajeConcrecion
        +String enlaceSistema
        +String enlaceCodigoFuente
        +List~Logro~ logros
        +List~Contribucion~ contribuciones
        +anotar(PersonaColaboradora, Boolean anonima)
        +leSirveA(PersonaColaboradora) Boolean
        +finalizar()
        +registrarAvance(int, Logro)
    }

    class Perfil {
        +String descripcion
        +List~Habilidad~ habilidadesRequeridas
        +List~Habilidad~ habilidadesOpcionales
        +Compromiso compromiso
        +Modalidad modalidad
    }

    class Logro {
        +String descripcion
    }

    class Contribucion {
        +PersonaColaboradora persona
        +Boolean anonima
    }

    class Compromiso {
        +int horas
        +Periodicidad periodicidad
    }

    class Periodicidad {
        <<enumeration>>
        TOTAL
        SEMANAL
        MENSUAL
    }

    class Modalidad {
        +Boolean rentada
        +Boolean permiteContratacion
    }

    class Habilidad {
        +String codigo
        +String titulo
        +String descripcion
    }

    class PersonaColaboradora {
        +String nombreFantasia
        +String nombre
        +String apellido
        +CuentaGit cuenta
        +String pronombres
        +String presentacion
        +List~Habilidad~ habilidades
        +List~MedioDeContacto~ mediosDeContacto
        +List~MensajeInterno~ mensajes
        +Boolean aceptaSerContactada
        +aplicaA(Perfil) Boolean
        +contactarSobre(Perfil)
    }

    class MedioDeContacto {
        <<interface>>
        +enviar(MensajeInterno)
    }

    class EnviadorPorEmail {
        +String email
        +enviar(MensajeInterno)
    }

    class EnviadorPorWhatsApp {
        +String telefono
        +enviar(MensajeInterno)
    }

    class EnviadorPorSms {
        +String telefono
        +enviar(MensajeInterno)
    }

    class MensajeInterno {
        +String contenido
    }

    class CuentaGit {
        +Plataforma plataforma
        +String usuario
    }

    class Plataforma {
        <<enumeration>>
        GITHUB
        GITLAB
    }

    Colectivo "1" --> "*" Proyecto
    Colectivo --> "1" TipoColectivo
    Colectivo --> "0..1" Ubicacion
    Ubicacion --> NivelUbicacion
    Proyecto "1" --> "1..*" Perfil
    Proyecto "1" --> "*" Logro
    Proyecto "1" --> "*" Contribucion
    Perfil --> "1..*" Habilidad : requeridas
    Perfil --> "*" Habilidad : opcionales
    Perfil --> "1" Compromiso
    Perfil --> "1" Modalidad
    Compromiso --> Periodicidad
    Contribucion --> "1" PersonaColaboradora
    PersonaColaboradora --> "*" Habilidad
    PersonaColaboradora --> "*" MedioDeContacto
    PersonaColaboradora --> "0..1" CuentaGit
    MedioDeContacto <|.. EnviadorPorEmail
    MedioDeContacto <|.. EnviadorPorWhatsApp
    MedioDeContacto <|.. EnviadorPorSms
    MedioDeContacto ..> MensajeInterno
    PersonaColaboradora --> "*" MensajeInterno
    CuentaGit --> Plataforma
```

## Comportamiento principal

`PersonaColaboradora.aplicaA(perfil)`

```
aplicaA(perfil):
    return perfil.habilidadesRequeridas.todas(h => this.habilidades.contiene(h))
```

`PersonaColaboradora.contactarSobre(perfil)`

```
contactarSobre(perfil):
    si no this.aceptaSerContactada:
        return
    mensaje = new MensajeInterno("Buscamos un perfil " + perfil.descripcion)
    this.mensajes.agregar(mensaje)
    this.mediosDeContacto.cada(medio => medio.enviar(mensaje))
```

`Proyecto.leSirveA(persona)`

```
leSirveA(persona):
    return this.perfiles.alguno(p => persona.aplicaA(p))
```

`Proyecto.anotar(persona, anonima)`

```
anotar(persona, anonima):
    si this.finalizado:
        error ProyectoFinalizado
    this.contribuciones.agregar(new Contribucion(persona, anonima))
```

## Notas de diseño

### Entrega 2

- El `Perfil` concentra ahora lo que antes colgaba del `Proyecto`: habilidades, `Compromiso` y `Modalidad`. Un proyecto puede pedir varios perfiles con condiciones distintas.
- La `Contribucion` vuelve al modelo. En la entrega anterior la sacamos por ser un pasamanos; ahora tiene un dato propio — si es anónima o no — y eso le da identidad. Es un buen ejemplo de cuándo una clase se gana su lugar: cuando es necesaria para exhibir un comportamiento que nadie más puede (determinar si la contribución es anónima o no).
- La regla de matcheo quedó como "tiene todas las habilidades requeridas". El enunciado no la define con precisión; las opcionales podrían usarse para ordenar resultados en vez de para filtrar.
- `aplicaA()` vive en `PersonaColaboradora`, pero el mensaje inverso (`Perfil.esCubiertoPor(persona)`) sería equivalente. Alcanza con uno de los dos.
- Las búsquedas (colectivos buscando colaboradoras, colaboradoras buscando proyectos) requerirán soporte de los repositorios, ya que ninguna entidad del dominio conoce a todas las `PersonaColaboradora` o todos los `Proyecto` —como para buscar entre ellos—, y se apoyan en `aplicaA()` y `leSirveA()`.
- `MedioDeContacto` es una interfaz que entiende `enviar()`, con una implementación por medio (email, WhatsApp, SMS). Cada una guarda su propio dato (email o teléfono) y tiene código propio para integrarse con su sistema externo; esa diferencia de comportamiento es la que justifica la herencia. Así, `MedioDeContacto` implementa una suerte de patrón Adapter: le da a la plataforma una interfaz única para tres sistemas externos distintos.
- Si no implementaron la integración con los sistemas externos, esas tres clases pueden no existir: el enunciado solo pide que el envío se pueda testear, así que alcanza con mockear la interfaz `MedioDeContacto`.

### De la entrega 1

- `Modalidad` se resuelve con dos booleanos (`rentada`, `permiteContratacion`). Es una decisión de modelado entre varias posibles igualmente válidas.
- El anonimato de una `PersonaColaboradora` se deriva de si cargó `nombre`/`apellido`, sin necesidad de una jerarquía de clases. Hay otras formas válidas de modelarlo.
- `TipoColectivo` es un objeto y no un enum porque el enunciado anticipa que la clasificación se amplíe.
