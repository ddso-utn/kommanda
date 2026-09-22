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
        +List~Habilidad~ habilidadesRequeridas
        +Compromiso compromiso
        +Modalidad modalidad
        +Boolean finalizado
        +List~PersonaColaboradora~ colaboradoras
        +anotar(PersonaColaboradora)
        +finalizar()
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
        +tieneAlgunaDe(List~Habilidad~) Boolean
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
    Proyecto --> "1" Compromiso
    Proyecto --> "1" Modalidad
    Proyecto --> "*" Habilidad : requiere
    Proyecto "1" --> "*" PersonaColaboradora : colaboradoras
    Compromiso --> Periodicidad
    PersonaColaboradora --> "*" Habilidad
    PersonaColaboradora --> "0..1" CuentaGit
    CuentaGit --> Plataforma
```

## Notas de diseño

- `Proyecto.anotar()` valida que el proyecto no esté finalizado y que la persona tenga al menos una de las habilidades requeridas; recién ahí la suma a `colaboradoras`.
- `Proyecto.finalizar()` marca `finalizado = true`; a partir de ese momento `anotar()` falla.
- `TipoColectivo` es un objeto y no un enum porque el enunciado anticipa que la clasificación se amplíe.
- El anonimato de una `PersonaColaboradora` se deriva de si cargó `nombre`/`apellido`, sin necesidad de una jerarquía de clases. Hay otras formas válidas de modelarlo.
- `Modalidad` se resuelve con dos booleanos (`rentada`, `permiteContratacion`). Es una decisión de modelado entre varias posibles igualmente válidas.
- No modelamos una clase `Colaboracion`: hoy no tendría más que la persona anotada, así que sería un pasamanos sin comportamiento propio. La relación entre `Proyecto` y `PersonaColaboradora` alcanza. Cuando la colaboración tenga datos o reglas propias — fecha de anotación, estado, horas dedicadas — va a tener sentido darle su propia clase.
