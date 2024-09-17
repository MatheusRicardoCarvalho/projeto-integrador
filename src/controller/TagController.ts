import prisma from "../utils/prisma";
import { Request, Response } from "express";


export class TagController {

    async index(req: Request, res: Response) {
        const tags = await prisma.tag.findMany();
        return res.json({ tags })
    }

    async createTags(req: Request, res: Response) {
        const estiloDeVidaTags = [
          '#Vegano', '#Fitness', '#PetLover', '#Baladeiro', '#Nerd',
          '#Esportista', '#Artista', '#Religioso', '#Viajante', '#Leitor',
          '#Gamer', '#Músico', '#Cinefilo', '#Minimalista', '#Empreendedor',
          '#Estudante', '#Trabalhador', '#Família', '#Natureza', '#Saúde',
          '#Moda', '#Política', '#Cultura', '#Voluntário', '#Aventura',
          '#Romântico', '#Zen', '#Criativo', '#Curioso', '#Divertido'
        ];
      
        const higieneELimpezaTags = [
          '#Limpo', '#Organizado', '#Desorganizado', '#Bagunceiro', '#Faxineiro',
          '#Preguiçoso', '#Perfeccionista', '#Econômico', '#Desperdiçador',
          '#Reciclador', '#Sustentável', '#Higiênico', '#Anti-higiênico', '#Cheiroso',
          '#Fedorento', '#Alérgico', '#Doente', '#Saudável', '#Cozinheiro', '#Pedinte',
          '#Comilão', '#Vegetariano', '#Carnívoro', '#Beberrão', '#Sóbrio',
          '#Fumante', '#Não-fumante', '#Viciado', '#Limite', '#Regras'
        ];
      
        const privacidadeTags = [
          '#Reservado', '#Aberto', '#Intimidade', '#Compartilhamento', '#Individualista',
          '#Coletivista', '#Silencioso', '#Barulhento', '#Calmo', '#Agitado',
          '#Sério', '#Brincalhão', '#Educado', '#Mal-educado', '#Amigável',
          '#Hostil', '#Sociável', '#Solitário', '#Conversador', '#Calado',
          '#Ouvinte', '#Falante', '#Tímido', '#Extrovertido', '#Introvertido',
          '#Confidente', '#Fofoqueiro', '#Discreto', '#Exibido', '#Ciumento'
        ];
      
        try {
            const allTags: { name: string; type: string }[] = [];
      
          // Mapeia cada array de tags para adicionar o tipo correspondente
          estiloDeVidaTags.forEach(tag => allTags.push({ name: tag, type: 'Vida' }));
          higieneELimpezaTags.forEach(tag => allTags.push({ name: tag, type: 'Limpeza' }));
          privacidadeTags.forEach(tag => allTags.push({ name: tag, type: 'Privacidade' }));
      
          for (const tag of allTags) {
            const newTag = await prisma.tag.create({
              data: {
                name: tag.name,
                type: tag.type,
              },
            });
            console.log('Nova tag criada:', newTag);
          }
        } catch (error) {
          console.error('Erro ao criar as tags:', error);
        } finally {
            const tags = await prisma.tag.findMany();
            return res.json({ tags })
        }
      }
            
}